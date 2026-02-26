import 'package:flutter/material.dart';
import 'role_home_screen.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('OTP Кіру')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const RoleHomeScreen()),
          ),
          child: const Text('0000 арқылы кіру (mock)'),
        ),
      ),
    );
  }
}
