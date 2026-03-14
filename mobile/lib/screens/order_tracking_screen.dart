import 'package:flutter/material.dart';

class OrderTrackingScreen extends StatelessWidget {
  const OrderTrackingScreen({super.key, required this.isKk});
  final bool isKk;

  @override
  Widget build(BuildContext context) {
    final statuses = const [
      'created',
      'bidding',
      'assigned',
      'enroute_pickup',
      'loaded',
      'enroute_dropoff',
      'delivered'
    ];

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(isKk ? 'Тапсырыс трекингі' : 'Трекинг заказа', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          Container(
            height: 140,
            decoration: BoxDecoration(color: Colors.blueGrey.shade50, borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text(isKk ? 'Карта (MVP mock)' : 'Карта (MVP mock)')),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.builder(
              itemCount: statuses.length,
              itemBuilder: (_, i) => ListTile(
                leading: const Icon(Icons.check_circle_outline),
                title: Text(statuses[i]),
                subtitle: Text(isKk ? 'SLA таймер белсенді' : 'SLA таймер активен'),
              ),
            ),
          )
        ],
      ),
    );
  }
}
