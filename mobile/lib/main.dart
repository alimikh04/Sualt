import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() => runApp(const ITtcargoApp());

class ITtcargoApp extends StatelessWidget {
  const ITtcargoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ITtcargo',
      locale: const Locale('kk'),
      home: const LoginScreen(),
    );
  }
}
