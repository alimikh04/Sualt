import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const ITtcargoApp());
}

class ITtcargoApp extends StatefulWidget {
  const ITtcargoApp({super.key});

  @override
  State<ITtcargoApp> createState() => _ITtcargoAppState();
}

class _ITtcargoAppState extends State<ITtcargoApp> {
  Locale _locale = const Locale('kk');

  void _switchLocale(Locale locale) {
    setState(() => _locale = locale);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ITtcargo App',
      debugShowCheckedModeBanner: false,
      locale: _locale,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF0EA5E9),
      ),
      home: LoginScreen(onLocaleChange: _switchLocale, currentLocale: _locale),
    );
  }
}
