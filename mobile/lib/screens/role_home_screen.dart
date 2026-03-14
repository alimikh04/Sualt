import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'order_create_screen.dart';
import 'order_tracking_screen.dart';
import 'wallet_screen.dart';
import 'profile_screen.dart';

class RoleHomeScreen extends StatefulWidget {
  const RoleHomeScreen({super.key, required this.role, required this.locale});

  final UserRole role;
  final Locale locale;

  @override
  State<RoleHomeScreen> createState() => _RoleHomeScreenState();
}

class _RoleHomeScreenState extends State<RoleHomeScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final isKk = widget.locale.languageCode == 'kk';
    final pages = [
      OrderCreateScreen(role: widget.role, isKk: isKk),
      OrderTrackingScreen(isKk: isKk),
      WalletScreen(isKk: isKk),
      ProfileScreen(role: widget.role, isKk: isKk),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(isKk ? 'ITtcargo Қосымшасы' : 'ITtcargo Приложение'),
      ),
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (v) => setState(() => _index = v),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.add_box_outlined), label: isKk ? 'Тапсырыс' : 'Заказ'),
          NavigationDestination(icon: const Icon(Icons.local_shipping_outlined), label: isKk ? 'Трекинг' : 'Трекинг'),
          NavigationDestination(icon: const Icon(Icons.account_balance_wallet_outlined), label: isKk ? 'Әмиян' : 'Кошелек'),
          NavigationDestination(icon: const Icon(Icons.person_outline), label: isKk ? 'Профиль' : 'Профиль'),
        ],
      ),
    );
  }
}
