import 'package:flutter/material.dart';

class RoleHomeScreen extends StatelessWidget {
  const RoleHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Рөлге байланысты Home')),
      body: ListView(
        children: const [
          ListTile(title: Text('Order құру')),
          ListTile(title: Text('Bids тізімі')),
          ListTile(title: Text('Tracking')),
          ListTile(title: Text('Wallet')),
          ListTile(title: Text('Құжат жүктеу')),
        ],
      ),
    );
  }
}
