INSERT INTO tenants(id,name,type) VALUES
('11111111-1111-1111-1111-111111111111','Demo Shipper','shipper_company'),
('22222222-2222-2222-2222-222222222222','Demo Carrier','carrier_company');

-- Fuel seed
CREATE TABLE IF NOT EXISTS fuel_stations (
  id UUID PRIMARY KEY,
  name TEXT,
  city TEXT,
  price_ai92 NUMERIC(10,2)
);
INSERT INTO fuel_stations VALUES
('33333333-3333-3333-3333-333333333333','Qazaq Oil #1','Almaty',205.00),
('44444444-4444-4444-4444-444444444444','Helios #8','Astana',210.00);
