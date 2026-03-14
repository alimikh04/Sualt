import 'package:flutter/material.dart';
import 'login_screen.dart';

class OrderCreateScreen extends StatefulWidget {
  const OrderCreateScreen({super.key, required this.role, required this.isKk});

  final UserRole role;
  final bool isKk;

  @override
  State<OrderCreateScreen> createState() => _OrderCreateScreenState();
}

class _OrderCreateScreenState extends State<OrderCreateScreen> {
  String _type = 'city';
  final _pickupCtrl = TextEditingController(text: 'Almaty');
  final _dropCtrl = TextEditingController(text: 'Astana');
  final _cargoCtrl = TextEditingController(text: 'Құрылыс материалы');

  @override
  Widget build(BuildContext context) {
    final canCreate = widget.role == UserRole.shipper || widget.role == UserRole.corporate;
    return Padding(
      padding: const EdgeInsets.all(16),
      child: ListView(
        children: [
          Text(widget.isKk ? 'Тапсырыс құру' : 'Создать заказ', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 10),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'city', label: Text('City')),
              ButtonSegment(value: 'intercity', label: Text('Intercity')),
              ButtonSegment(value: 'magistral', label: Text('Magistral')),
            ],
            selected: {_type},
            onSelectionChanged: (v) => setState(() => _type = v.first),
          ),
          const SizedBox(height: 12),
          TextField(controller: _pickupCtrl, decoration: InputDecoration(labelText: widget.isKk ? 'Pickup' : 'Погрузка')),
          const SizedBox(height: 10),
          TextField(controller: _dropCtrl, decoration: InputDecoration(labelText: widget.isKk ? 'Dropoff' : 'Выгрузка')),
          const SizedBox(height: 10),
          TextField(controller: _cargoCtrl, decoration: InputDecoration(labelText: widget.isKk ? 'Жүк сипаттамасы' : 'Описание груза')),
          const SizedBox(height: 14),
          FilledButton(
            onPressed: canCreate
                ? () => ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(widget.isKk ? 'Тапсырыс жарияланды (mock)' : 'Заказ опубликован (mock)')),
                    )
                : null,
            child: Text(widget.isKk ? 'Аукционға жіберу' : 'Отправить в аукцион'),
          ),
          if (!canCreate)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                widget.isKk ? 'Бұл рөл тапсырыс құра алмайды' : 'Эта роль не может создавать заказы',
                style: const TextStyle(color: Colors.red),
              ),
            )
        ],
      ),
    );
  }
}
