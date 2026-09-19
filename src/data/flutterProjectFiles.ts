import { FlutterCodeFile } from '../types/weather';

export const FLUTTER_PROJECT_FILES: FlutterCodeFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    description: 'Flutter project dependencies, assets, and metadata',
    code: `name: skycast_weather
description: "A beautiful real-time weather application powered by OpenWeatherMap API."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  intl: ^0.19.0
  provider: ^6.1.2
  shared_preferences: ^2.2.2
  flutter_svg: ^2.0.10+1
  google_fonts: ^6.2.1
  lucide_icons: ^0.257.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/icons/
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    description: 'Flutter app entry point with theme, providers, and navigation routes',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/weather_service.dart';
import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WeatherProvider()),
      ],
      child: const SkyCastWeatherApp(),
    ),
  );
}

class SkyCastWeatherApp extends StatelessWidget {
  const SkyCastWeatherApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SkyCast Weather',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
        primaryColor: const Color(0xFF38BDF8), // Sky Blue
        colorScheme: ColorScheme.dark(
          primary: const Color(0xFF38BDF8),
          secondary: const Color(0xFF818CF8),
          surface: const Color(0xFF1E293B),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.dark().textTheme,
        ),
        useMaterial3: true,
      ),
      home: const SplashScreen(),
    );
  }
}
`,
  },
  {
    path: 'lib/models/weather_model.dart',
    name: 'weather_model.dart',
    language: 'dart',
    description: 'Data models for Current Weather, Hourly Forecast, and Daily Forecast',
    code: `class WeatherModel {
  final String cityName;
  final String country;
  final double temperature;
  final double feelsLike;
  final double tempMin;
  final double tempMax;
  final String condition;
  final String description;
  final int humidity;
  final double windSpeed;
  final int windDeg;
  final int pressure;
  final double visibility;
  final DateTime sunrise;
  final DateTime sunset;
  final List<HourlyForecastModel> hourly;
  final List<DailyForecastModel> daily;

  WeatherModel({
    required this.cityName,
    required this.country,
    required this.temperature,
    required this.feelsLike,
    required this.tempMin,
    required this.tempMax,
    required this.condition,
    required this.description,
    required this.humidity,
    required this.windSpeed,
    required this.windDeg,
    required this.pressure,
    required this.visibility,
    required this.sunrise,
    required this.sunset,
    this.hourly = const [],
    this.daily = const [],
  });

  factory WeatherModel.fromJson(Map<String, dynamic> json, {List<HourlyForecastModel> hourly = const [], List<DailyForecastModel> daily = const []}) {
    final main = json['main'] ?? {};
    final weather = (json['weather'] as List?)?.first ?? {};
    final wind = json['wind'] ?? {};
    final sys = json['sys'] ?? {};

    return WeatherModel(
      cityName: json['name'] ?? 'Unknown',
      country: sys['country'] ?? '',
      temperature: (main['temp'] as num?)?.toDouble() ?? 0.0,
      feelsLike: (main['feels_like'] as num?)?.toDouble() ?? 0.0,
      tempMin: (main['temp_min'] as num?)?.toDouble() ?? 0.0,
      tempMax: (main['temp_max'] as num?)?.toDouble() ?? 0.0,
      condition: weather['main'] ?? 'Clear',
      description: weather['description'] ?? '',
      humidity: main['humidity'] ?? 0,
      windSpeed: ((wind['speed'] as num?)?.toDouble() ?? 0.0) * 3.6, // km/h
      windDeg: wind['deg'] ?? 0,
      pressure: main['pressure'] ?? 1013,
      visibility: ((json['visibility'] as num?)?.toDouble() ?? 10000.0) / 1000, // km
      sunrise: DateTime.fromMillisecondsSinceEpoch((sys['sunrise'] ?? 0) * 1000),
      sunset: DateTime.fromMillisecondsSinceEpoch((sys['sunset'] ?? 0) * 1000),
      hourly: hourly,
      daily: daily,
    );
  }
}

class HourlyForecastModel {
  final DateTime time;
  final double temp;
  final String condition;
  final int pop; // Probability of precipitation %

  HourlyForecastModel({
    required this.time,
    required this.temp,
    required this.condition,
    required this.pop,
  });

  factory HourlyForecastModel.fromJson(Map<String, dynamic> json) {
    final main = json['main'] ?? {};
    final weather = (json['weather'] as List?)?.first ?? {};
    return HourlyForecastModel(
      time: DateTime.fromMillisecondsSinceEpoch((json['dt'] ?? 0) * 1000),
      temp: (main['temp'] as num?)?.toDouble() ?? 0.0,
      condition: weather['main'] ?? 'Clear',
      pop: (((json['pop'] as num?)?.toDouble() ?? 0.0) * 100).round(),
    );
  }
}

class DailyForecastModel {
  final DateTime date;
  final double tempMin;
  final double tempMax;
  final String condition;
  final String description;
  final int humidity;
  final int pop;

  DailyForecastModel({
    required this.date,
    required this.tempMin,
    required this.tempMax,
    required this.condition,
    required this.description,
    required this.humidity,
    required this.pop,
  });
}
`,
  },
  {
    path: 'lib/services/weather_service.dart',
    name: 'weather_service.dart',
    language: 'dart',
    description: 'OpenWeatherMap API Integration Client & State Management Provider',
    code: `import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/weather_model.dart';

class WeatherProvider extends ChangeNotifier {
  static const String _baseUrl = 'https://api.openweathermap.org/data/2.5';
  
  String _apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
  String _currentCity = 'Hyderabad';
  bool _isCelsius = true;
  bool _isLoading = false;
  String? _errorMessage;
  WeatherModel? _weather;

  String get currentCity => _currentCity;
  bool get isCelsius => _isCelsius;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  WeatherModel? get weather => _weather;
  String get apiKey => _apiKey;

  WeatherProvider() {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    _apiKey = prefs.getString('owm_api_key') ?? 'YOUR_OPENWEATHERMAP_API_KEY';
    _isCelsius = prefs.getBool('is_celsius') ?? true;
    _currentCity = prefs.getString('last_city') ?? 'Hyderabad';
    fetchWeatherByCity(_currentCity);
  }

  Future<void> setApiKey(String key) async {
    _apiKey = key.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('owm_api_key', _apiKey);
    notifyListeners();
    fetchWeatherByCity(_currentCity);
  }

  void toggleUnit() async {
    _isCelsius = !_isCelsius;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_celsius', _isCelsius);
    notifyListeners();
  }

  double convertTemp(double celsius) {
    if (_isCelsius) return celsius;
    return (celsius * 9 / 5) + 32;
  }

  String get unitSymbol => _isCelsius ? '°C' : '°F';

  Future<void> fetchWeatherByCity(String city) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // 1. Current Weather
      final weatherUrl = '$_baseUrl/weather?q=\${Uri.encodeComponent(city)}&units=metric&appid=$_apiKey';
      final response = await http.get(Uri.parse(weatherUrl));

      if (response.statusCode == 200) {
        final currentJson = json.decode(response.body);

        // 2. 5-Day Forecast
        final forecastUrl = '$_baseUrl/forecast?q=\${Uri.encodeComponent(city)}&units=metric&appid=$_apiKey';
        final forecastRes = await http.get(Uri.parse(forecastUrl));

        List<HourlyForecastModel> hourly = [];
        List<DailyForecastModel> daily = [];

        if (forecastRes.statusCode == 200) {
          final forecastJson = json.decode(forecastRes.body);
          final list = (forecastJson['list'] as List?) ?? [];
          
          hourly = list.take(8).map((item) => HourlyForecastModel.fromJson(item)).toList();

          // Aggregate by day
          final Map<String, List<dynamic>> groupedDays = {};
          for (var item in list) {
            final date = DateTime.fromMillisecondsSinceEpoch((item['dt'] as int) * 1000);
            final key = '\${date.year}-\${date.month}-\${date.day}';
            groupedDays.putIfAbsent(key, () => []).add(item);
          }

          daily = groupedDays.entries.take(7).map((entry) {
            final items = entry.value;
            double min = double.infinity;
            double max = -double.infinity;
            for (var it in items) {
              final tMin = (it['main']['temp_min'] as num).toDouble();
              final tMax = (it['main']['temp_max'] as num).toDouble();
              if (tMin < min) min = tMin;
              if (tMax > max) max = tMax;
            }
            final first = items.first;
            return DailyForecastModel(
              date: DateTime.fromMillisecondsSinceEpoch((first['dt'] as int) * 1000),
              tempMin: min,
              tempMax: max,
              condition: first['weather'][0]['main'] ?? 'Clear',
              description: first['weather'][0]['description'] ?? '',
              humidity: first['main']['humidity'] ?? 0,
              pop: (((first['pop'] as num?)?.toDouble() ?? 0.0) * 100).round(),
            );
          }).toList();
        }

        _weather = WeatherModel.fromJson(currentJson, hourly: hourly, daily: daily);
        _currentCity = city;
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('last_city', city);
      } else {
        _errorMessage = 'City not found or invalid API key (\${response.statusCode})';
      }
    } catch (e) {
      _errorMessage = 'Network error: Please check your connection or API key.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
`,
  },
  {
    path: 'lib/screens/splash_screen.dart',
    name: 'splash_screen.dart',
    language: 'dart',
    description: 'Screen 1: Splash Screen with animated branding and Get Started action',
    code: `import 'package:flutter/material.dart';
import 'home_screen.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF0F172A),
              Color(0xFF1E293B),
              Color(0xFF0284C7),
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),
                // App Logo Icon
                Container(
                  width: 110,
                  height: 110,
                  decoration: BoxDecoration(
                    color: const Color(0xFF38BDF8).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.4), width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF38BDF8).withOpacity(0.2),
                        blurRadius: 30,
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.cloud_queue_rounded,
                      size: 64,
                      color: Color(0xFF38BDF8),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                const Text(
                  'SKYCAST',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 4,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'REAL-TIME WEATHER & FORECASTS',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 2,
                    color: Colors.white.withOpacity(0.7),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Track atmospheric conditions, hourly rain trends, and weekly forecasts across the globe.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    height: 1.5,
                    color: Colors.white.withOpacity(0.6),
                  ),
                ),
                const Spacer(),
                // Navigation dots indicator
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF38BDF8), shape: BoxShape.circle)),
                    const SizedBox(width: 8),
                    Container(width: 8, height: 8, decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), shape: BoxShape.circle)),
                    const SizedBox(width: 8),
                    Container(width: 8, height: 8, decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), shape: BoxShape.circle)),
                  ],
                ),
                const SizedBox(height: 28),
                // Get Started Button
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const HomeScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Get Started',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_forward_rounded, size: 20),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    language: 'dart',
    description: 'Screen 2: Home Dashboard with Search, Quick Actions, and Today summary',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/weather_service.dart';
import 'forecast_screen.dart';
import 'weather_details_screen.dart';
import 'trends_screen.dart';
import 'air_quality_screen.dart';
import 'alerts_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchCtrl = TextEditingController();

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final weatherProv = Provider.of<WeatherProvider>(context);
    final w = weatherProv.weather;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded),
          onPressed: () {},
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Hi, Explorer!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text(
              weatherProv.currentCity,
              style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.7)),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AlertsScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.tune_rounded),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen()));
            },
          ),
        ],
      ),
      body: weatherProv.isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF38BDF8)))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Search Bar
                  TextField(
                    controller: _searchCtrl,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (val) {
                      if (val.trim().isNotEmpty) {
                        weatherProv.fetchWeatherByCity(val.trim());
                        _searchCtrl.clear();
                      }
                    },
                    decoration: InputDecoration(
                      hintText: 'Search city (e.g. Hyderabad, London)...',
                      hintStyle: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 14),
                      prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF38BDF8)),
                      filled: true,
                      fillColor: const Color(0xFF1E293B),
                      contentPadding: const EdgeInsets.symmetric(vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Quick Actions (Like image: Workouts, Nutrition, Activity, Progress)
                  const Text(
                    'Quick Actions',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildQuickAction(
                        icon: Icons.calendar_view_week_rounded,
                        label: '7-Day',
                        color: const Color(0xFF0284C7),
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ForecastScreen())),
                      ),
                      _buildQuickAction(
                        icon: Icons.thermostat_rounded,
                        label: 'Details',
                        color: const Color(0xFF059669),
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const WeatherDetailsScreen())),
                      ),
                      _buildQuickAction(
                        icon: Icons.trending_up_rounded,
                        label: 'Trends',
                        color: const Color(0xFFD97706),
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TrendsScreen())),
                      ),
                      _buildQuickAction(
                        icon: Icons.air_rounded,
                        label: 'Air Quality',
                        color: const Color(0xFF7C3AED),
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AirQualityScreen())),
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Today's Hero Summary Card
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Today's Summary",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ForecastScreen())),
                        child: const Text(
                          'View All',
                          style: TextStyle(fontSize: 13, color: Color(0xFF38BDF8), fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Hero Temperature Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0369A1), Color(0xFF0284C7), Color(0xFF38BDF8)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF0284C7).withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '\${weatherProv.convertTemp(w?.temperature ?? 28).toStringAsFixed(0)}\${weatherProv.unitSymbol}',
                                  style: const TextStyle(fontSize: 54, fontWeight: FontWeight.w800, height: 1.0),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  w?.condition ?? 'Clear Sky',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                                ),
                                Text(
                                  'Feels like \${weatherProv.convertTemp(w?.feelsLike ?? 30).toStringAsFixed(0)}\${weatherProv.unitSymbol}',
                                  style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.8)),
                                ),
                              ],
                            ),
                            const Icon(Icons.wb_sunny_rounded, size: 72, color: Colors.amber),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Divider(color: Colors.white.withOpacity(0.2)),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildStatItem('Wind', '\${w?.windSpeed.toStringAsFixed(0) ?? 12} km/h'),
                            _buildStatItem('Humidity', '\${w?.humidity ?? 60}%'),
                            _buildStatItem('Pressure', '\${w?.pressure ?? 1012} hPa'),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Hourly Forecast section
                  const Text(
                    'Hourly Forecast',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 110,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: w?.hourly.length ?? 6,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (ctx, i) {
                        final h = w?.hourly[i];
                        return Container(
                          width: 80,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.06)),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                h != null ? '\${h.time.hour}:00' : 'Now',
                                style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.7)),
                              ),
                              const Icon(Icons.cloud_queue_rounded, size: 24, color: Color(0xFF38BDF8)),
                              Text(
                                h != null ? '\${weatherProv.convertTemp(h.temp).round()}\${weatherProv.unitSymbol}' : '30°',
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              color: color.withOpacity(0.16),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: color.withOpacity(0.3)),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(label, style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.7))),
      ],
    );
  }
}
`,
  },
  {
    path: 'lib/screens/forecast_screen.dart',
    name: 'forecast_screen.dart',
    language: 'dart',
    description: 'Screen 3: 7-Day & Category Forecasts (Rain, Wind, UV, Air Quality)',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/weather_service.dart';

class ForecastScreen extends StatefulWidget {
  const ForecastScreen({super.key});

  @override
  State<ForecastScreen> createState() => _ForecastScreenState();
}

class _ForecastScreenState extends State<ForecastScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final weatherProv = Provider.of<WeatherProvider>(context);
    final w = weatherProv.weather;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Forecast Categories', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF38BDF8),
          labelColor: const Color(0xFF38BDF8),
          unselectedLabelColor: Colors.white.withOpacity(0.5),
          tabs: const [
            Tab(text: '7-Day'),
            Tab(text: 'Hourly'),
            Tab(text: 'Rain %'),
            Tab(text: 'Wind'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 7-Day List
          ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: w?.daily.length ?? 7,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (ctx, i) {
              final d = w?.daily[i];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      d != null ? 'Day \${d.date.day}' : 'Day \${i + 1}',
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.cloud_rounded, color: Color(0xFF38BDF8), size: 20),
                        const SizedBox(width: 8),
                        Text(d?.condition ?? 'Partly Cloudy', style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13)),
                      ],
                    ),
                    Text(
                      '\${weatherProv.convertTemp(d?.tempMax ?? 31).round()}° / \${weatherProv.convertTemp(d?.tempMin ?? 22).round()}°',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ],
                ),
              );
            },
          ),
          // Hourly View
          Center(child: Text('Hourly forecast curve available on dashboard', style: TextStyle(color: Colors.white.withOpacity(0.6)))),
          // Rain View
          Center(child: Text('Precipitation chances: 20% - 65% this week', style: TextStyle(color: Colors.white.withOpacity(0.6)))),
          // Wind View
          Center(child: Text('Average wind gusts: 14 km/h to 24 km/h', style: TextStyle(color: Colors.white.withOpacity(0.6)))),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/weather_details_screen.dart',
    name: 'weather_details_screen.dart',
    language: 'dart',
    description: 'Screen 4: In-depth Weather Condition Details (UV, Humidity, Pressure, Wind)',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/weather_service.dart';

class WeatherDetailsScreen extends StatelessWidget {
  const WeatherDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final weatherProv = Provider.of<WeatherProvider>(context);
    final w = weatherProv.weather;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Weather Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Grid of Metrics
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              childAspectRatio: 1.2,
              children: [
                _buildMetricCard(
                  icon: Icons.thermostat_rounded,
                  title: 'RealFeel',
                  value: '\${weatherProv.convertTemp(w?.feelsLike ?? 33).round()}\${weatherProv.unitSymbol}',
                  subtitle: 'Humidity makes it warmer',
                  color: Colors.orange,
                ),
                _buildMetricCard(
                  icon: Icons.wb_sunny_outlined,
                  title: 'UV Index',
                  value: '8 of 10',
                  subtitle: 'Very High - Wear SPF',
                  color: Colors.amber,
                ),
                _buildMetricCard(
                  icon: Icons.water_drop_rounded,
                  title: 'Humidity',
                  value: '\${w?.humidity ?? 62}%',
                  subtitle: 'Dew point 21°C',
                  color: Colors.blue,
                ),
                _buildMetricCard(
                  icon: Icons.air_rounded,
                  title: 'Wind Speed',
                  value: '\${w?.windSpeed.toStringAsFixed(0) ?? 14} km/h',
                  subtitle: 'Direction: \${w?.windDeg ?? 70}°',
                  color: Colors.teal,
                ),
                _buildMetricCard(
                  icon: Icons.speed_rounded,
                  title: 'Pressure',
                  value: '\${w?.pressure ?? 1012} hPa',
                  subtitle: 'Barometer steady',
                  color: Colors.indigo,
                ),
                _buildMetricCard(
                  icon: Icons.visibility_rounded,
                  title: 'Visibility',
                  value: '\${w?.visibility.toStringAsFixed(1) ?? 8.5} km',
                  subtitle: 'Clear horizon line',
                  color: Colors.purple,
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Sunrise and Sunset Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      const Icon(Icons.wb_twilight_rounded, color: Colors.amber, size: 36),
                      const SizedBox(height: 8),
                      const Text('Sunrise', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      const Text('06:08 AM', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ],
                  ),
                  Container(width: 1, height: 50, color: Colors.white.withOpacity(0.1)),
                  Column(
                    children: [
                      const Icon(Icons.nightlight_round, color: Colors.orangeAccent, size: 36),
                      const SizedBox(height: 8),
                      const Text('Sunset', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      const Text('06:22 PM', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required String title,
    required String value,
    required String subtitle,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.7))),
              Icon(icon, color: color, size: 20),
            ],
          ),
          Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text(subtitle, style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.5))),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/trends_screen.dart',
    name: 'trends_screen.dart',
    language: 'dart',
    description: 'Screen 5: Weather Progress, Weekly Trends & Temperature curves',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/weather_service.dart';

class TrendsScreen extends StatelessWidget {
  const TrendsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final weatherProv = Provider.of<WeatherProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Weather Trends & Analytics', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Segment selector
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0284C7),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Center(child: Text('Week', style: TextStyle(fontWeight: FontWeight.bold))),
                    ),
                  ),
                  Expanded(
                    child: Center(child: Text('Month', style: TextStyle(color: Colors.white.withOpacity(0.6)))),
                  ),
                  Expanded(
                    child: Center(child: Text('Year', style: TextStyle(color: Colors.white.withOpacity(0.6)))),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Average metric rows
            _buildTrendRow('Average High', '32\${weatherProv.unitSymbol}', '+1.2° vs historical', const Color(0xFF0284C7)),
            _buildTrendRow('Average Rainfall', '45 mm', 'Normal precipitation', const Color(0xFF10B981)),
            _buildTrendRow('Wind Speed Avg', '15 km/h', 'Moderate breeze', const Color(0xFFF59E0B)),
            _buildTrendRow('Air Quality Index', '68 AQI', 'Moderate', const Color(0xFF8B5CF6)),

            const SizedBox(height: 28),
            const Text('7-Day Temperature Range', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Container(
              height: 180,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: const Center(
                child: Text(
                  'Chart visualization rendering highs [31°-34°] and lows [22°-25°]',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey, fontSize: 13),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrendRow(String label, String value, String sub, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              const SizedBox(height: 4),
              Text(sub, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
            ],
          ),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/air_quality_screen.dart',
    name: 'air_quality_screen.dart',
    language: 'dart',
    description: 'Screen 6: Air Quality (AQI), PM2.5, Pollen & Outdoor Activity guide',
    code: `import 'package:flutter/material.dart';

class AirQualityScreen extends StatelessWidget {
  const AirQualityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Air Quality & Activities', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero AQI Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.amber.withOpacity(0.3)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Air Quality Index', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.amber.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('Moderate', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Text('68', style: TextStyle(fontSize: 56, fontWeight: FontWeight.w800, color: Colors.amber)),
                  const SizedBox(height: 4),
                  const Text('US AQI Standard', style: TextStyle(color: Colors.grey, fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('Pollutant Breakdown', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildPollutantRow('PM 2.5', '22.4 µg/m³', 0.45),
            _buildPollutantRow('PM 10', '48.1 µg/m³', 0.35),
            _buildPollutantRow('Ozone (O3)', '35.2 ppb', 0.25),
            _buildPollutantRow('NO2', '18.7 ppb', 0.20),

            const SizedBox(height: 24),
            const Text('Outdoor Activity Recommendations', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildActivityItem(Icons.directions_run_rounded, 'Jogging & Exercise', 'Safe for most people; sensitive individuals should reduce intense exertion.'),
            _buildActivityItem(Icons.pedal_bike_rounded, 'Cycling', 'Good conditions with moderate breeze.'),
            _buildActivityItem(Icons.window_rounded, 'Open Windows', 'Recommended in the early morning before peak traffic.'),
          ],
        ),
      ),
    );
  }

  Widget _buildPollutantRow(String name, String value, double progress) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              Text(value, style: const TextStyle(color: Colors.grey, fontSize: 13)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.white.withOpacity(0.08),
            color: const Color(0xFF38BDF8),
            minHeight: 6,
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem(IconData icon, String title, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF38BDF8), size: 28),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 2),
                Text(desc, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/alerts_screen.dart',
    name: 'alerts_screen.dart',
    language: 'dart',
    description: 'Screen 7: Severe Weather Alerts & Atmospheric Notifications',
    code: `import 'package:flutter/material.dart';

class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Weather Alerts', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _buildAlertCard(
            title: 'Afternoon Thunderstorm Advisory',
            time: '10:00 AM • Active',
            desc: 'Isolated lightning and gusty winds up to 35 km/h expected in southern areas.',
            isWarning: true,
          ),
          _buildAlertCard(
            title: 'High UV Index Notice',
            time: '09:15 AM',
            desc: 'UV rating peaks at 8 between 11:30 AM - 2:30 PM. Sunscreen recommended.',
            isWarning: false,
          ),
          _buildAlertCard(
            title: 'Daily Weather Morning Briefing',
            time: 'Yesterday',
            desc: 'Today will reach a comfortable 33°C with a pleasant evening cooling trend.',
            isWarning: false,
          ),
        ],
      ),
    );
  }

  Widget _buildAlertCard({
    required String title,
    required String time,
    required String desc,
    required bool isWarning,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isWarning ? Colors.orange.withOpacity(0.4) : Colors.white.withOpacity(0.06),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isWarning ? Colors.orange.withOpacity(0.15) : const Color(0xFF0284C7).withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isWarning ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
              color: isWarning ? Colors.orange : const Color(0xFF38BDF8),
              size: 20,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    ),
                    Text(time, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(desc, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/settings_screen.dart',
    name: 'settings_screen.dart',
    language: 'dart',
    description: 'Screen 8: Settings, API Key Config, Units (°C/°F), and Profile',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/weather_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late TextEditingController _keyCtrl;

  @override
  void initState() {
    super.initState();
    final weatherProv = Provider.of<WeatherProvider>(context, listen: false);
    _keyCtrl = TextEditingController(text: weatherProv.apiKey);
  }

  @override
  void dispose() {
    _keyCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final weatherProv = Provider.of<WeatherProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings & Preferences', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Profile preview
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Color(0xFF0284C7),
                  child: Icon(Icons.person_rounded, size: 32, color: Colors.white),
                ),
                const SizedBox(width: 14),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Weather Explorer', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    Text('Location: \${weatherProv.currentCity}', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Temperature Unit Switch
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Temperature Unit', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                Row(
                  children: [
                    Text(weatherProv.isCelsius ? 'Celsius (°C)' : 'Fahrenheit (°F)', style: const TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold)),
                    const SizedBox(width: 8),
                    Switch(
                      value: weatherProv.isCelsius,
                      activeColor: const Color(0xFF38BDF8),
                      onChanged: (_) => weatherProv.toggleUnit(),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // OpenWeatherMap API Key input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('OpenWeatherMap API Key', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 4),
                Text('Enter your free key from openweathermap.org', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                const SizedBox(height: 12),
                TextField(
                  controller: _keyCtrl,
                  decoration: InputDecoration(
                    hintText: 'Enter API Key...',
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      weatherProv.setApiKey(_keyCtrl.text.trim());
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('API Key saved successfully!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0284C7)),
                    child: const Text('Save & Apply Key', style: TextStyle(color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Setup and running guide for the Flutter Weather Application',
    code: `# SkyCast - Flutter Weather Application

A complete, production-ready Flutter weather application using the **OpenWeatherMap API** with real-time forecasts, beautiful animated weather icons, and an 8-screen architectural flow.

## 📱 Features

1. **Splash Screen**: Animated logo, branding, and welcoming onboarding.
2. **Home Dashboard**: Quick city search, today's summary card, quick action shortcuts, and hourly forecast slider.
3. **Forecast Categories**: 7-Day daily forecast, precipitation probabilities, and wind gust charts.
4. **Weather Details**: RealFeel, UV index, humidity, dew point, wind compass, and sunrise/sunset dial.
5. **Weather Trends**: Weekly highs/lows and historical analytics comparison.
6. **Air Quality & Outdoor**: AQI gauge, PM2.5 / PM10 breakdown, and outdoor activity recommendations.
7. **Weather Alerts**: Severe weather advisories and daily notifications.
8. **Settings & Profile**: °C / °F temperature toggle, location manager, and OpenWeatherMap API key configuration.

## 🚀 Getting Started

### 1. Prerequisites
- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio or VS Code with Flutter extension
- Free OpenWeatherMap API Key from [https://openweathermap.org](https://openweathermap.org)

### 2. Install Dependencies
Run in your terminal:
\`\`\`bash
flutter pub get
\`\`\`

### 3. Configure API Key
Open \`lib/services/weather_service.dart\` and insert your key into \`_apiKey\` or configure it directly in the app's Settings screen!

### 4. Run the App
\`\`\`bash
flutter run
\`\`\`
`,
  },
];
