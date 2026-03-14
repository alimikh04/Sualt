import 'package:flutter/material.dart';
import 'role_home_screen.dart';

enum UserRole { shipper, driver, carrierAdmin, corporate }

class LoginScreen extends StatefulWidget {
  const LoginScreen({
    super.key,
    required this.onLocaleChange,
    required this.currentLocale,
  });

  final void Function(Locale) onLocaleChange;
  final Locale currentLocale;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneCtrl = TextEditingController(text: '+7 701 111 22 33');
  final _otpCtrl = TextEditingController(text: '0000');
  UserRole _selectedRole = UserRole.shipper;

  String _label(String kk, String ru) => widget.currentLocale.languageCode == 'kk' ? kk : ru;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ITtcargo SuperApp', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 8),
                  Text(_label('Қосымшаға кіру (OTP mock)', 'Вход в приложение (OTP mock)')),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      ChoiceChip(
                        label: const Text('KK'),
                        selected: widget.currentLocale.languageCode == 'kk',
                        onSelected: (_) => widget.onLocaleChange(const Locale('kk')),
                      ),
                      const SizedBox(width: 8),
                      ChoiceChip(
                        label: const Text('RU'),
                        selected: widget.currentLocale.languageCode == 'ru',
                        onSelected: (_) => widget.onLocaleChange(const Locale('ru')),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(controller: _phoneCtrl, decoration: InputDecoration(labelText: _label('Телефон', 'Телефон'))),
                  const SizedBox(height: 12),
                  TextField(controller: _otpCtrl, decoration: const InputDecoration(labelText: 'OTP (0000)')),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<UserRole>(
                    value: _selectedRole,
                    decoration: InputDecoration(labelText: _label('Рөл', 'Роль')),
                    items: const [
                      DropdownMenuItem(value: UserRole.shipper, child: Text('Shipper')),
                      DropdownMenuItem(value: UserRole.driver, child: Text('Driver')),
                      DropdownMenuItem(value: UserRole.carrierAdmin, child: Text('Carrier Admin')),
                      DropdownMenuItem(value: UserRole.corporate, child: Text('Corporate')),
                    ],
                    onChanged: (v) => setState(() => _selectedRole = v ?? UserRole.shipper),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (_) => RoleHomeScreen(role: _selectedRole, locale: widget.currentLocale),
                          ),
                        );
                      },
                      child: Text(_label('Кіру', 'Войти')),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
