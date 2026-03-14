import 'package:flutter/material.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key, required this.isKk});
  final bool isKk;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(isKk ? 'ITtcargo Pay Әмиян' : 'ITtcargo Pay Кошелек', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              title: const Text('Баланс / Баланс'),
              subtitle: const Text('KZT'),
              trailing: Text('₸ 1,240,000', style: Theme.of(context).textTheme.titleLarge),
            ),
          ),
          const SizedBox(height: 10),
          const ListTile(
            leading: Icon(Icons.lock_clock_outlined),
            title: Text('Escrow hold'),
            trailing: Text('₸ 210,000'),
          ),
          const ListTile(
            leading: Icon(Icons.payments_outlined),
            title: Text('Release to carrier'),
            trailing: Text('₸ 180,000'),
          ),
        ],
      ),
    );
  }
}
