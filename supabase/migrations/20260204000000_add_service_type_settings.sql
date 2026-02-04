-- Add service type enablement settings to site_settings table
INSERT INTO site_settings (id, value, type, description) VALUES
  ('enable_dine_in', 'true', 'boolean', 'Whether dine-in service is enabled'),
  ('enable_pickup', 'true', 'boolean', 'Whether pickup service is enabled'),
  ('enable_delivery', 'true', 'boolean', 'Whether delivery service is enabled')
ON CONFLICT (id) DO NOTHING;
