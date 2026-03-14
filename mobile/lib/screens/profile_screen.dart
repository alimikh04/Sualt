import 'package:flutter/material.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key, required this.role, required this.isKk});
  final UserRole role;
  final bool isKk;

  String roleName(UserRole role) {
    switch (role) {
      case UserRole.shipper:
        return 'shipper';
      case UserRole.driver:
        return 'driver';
      case UserRole.carrierAdmin:
        return 'carrier_admin';
      case UserRole.corporate:
        return 'corporate';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: ListView(
        children: [
          Text(isKk ? 'Профиль' : 'Профиль', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          const ListTile(
            leading: Icon(Icons.phone_outlined),
            title: Text('+7 701 111 22 33'),
            subtitle: Text('KZ user'),
          ),
          ListTile(
            leading: const Icon(Icons.badge_outlined),
            title: const Text('Active role'),
            subtitle: Text(roleName(role)),
          ),
          const ListTile(
            leading: Icon(Icons.verified_user_outlined),
            title: Text('KYC status'),
            subtitle: Text('pending / verified'),
          ),
          const ListTile(
            leading: Icon(Icons.description_outlined),
            title: Text('Құжат жүктеу / Загрузка документов'),
            subtitle: Text('eTTN, id card, license'),
          ),
        ],
      ),
    );
  }
}
