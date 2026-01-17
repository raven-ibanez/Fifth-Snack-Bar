/*
  # Add Fifth Snack Bar Menu Items (Hybrid Version)
  
  1. Categories
    - Ensure 'snacks' and 'drinks' categories exist
  2. Snacks
    - All snacks inserted as individual items (one-by-one)
  3. Drinks
    - One item per flavor
    - Size variations: Small (+0), Medium (+10), Large (+20)
  4. Add-ons
    - Sauce add-ons for all snacks
    - Topping add-ons for all drinks
*/

-- 1. Create or Update Categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('snacks', 'Snacks', '🍟', 5, true),
  ('drinks', 'Drinks', '🥤', 6, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Snacks (One by One)
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Shawarma Wrap', 'Delicious Shawarma Wrap', 55, 'snacks', true, true),
  ('Shawarma Wrap 2pcs', 'Shared Shawarma Wraps', 100, 'snacks', false, true),
  ('Shawarma Fries Wrap', 'Shawarma with Fries in a Wrap', 65, 'snacks', false, true),
  ('Shawarma Fries', 'Crispy fries with shawarma toppings', 55, 'snacks', true, true),
  ('Shawarma Fries 2pcs', 'Shared Shawarma Fries', 100, 'snacks', false, true),
  ('Nacho''s Solo', 'Personal size crispy nachos', 50, 'snacks', false, true),
  ('Nacho''s BFF', 'Sharing size crispy nachos', 100, 'snacks', false, true),
  ('Nacho Mix Fries Solo', 'Personal size nacho and fries combo', 60, 'snacks', false, true),
  ('Nacho Mix Fries BFF', 'Sharing size nacho and fries combo', 110, 'snacks', false, true),
  ('Fries Solo', 'Personal size classic fries', 30, 'snacks', false, true),
  ('Fries BFF', 'Sharing size classic fries', 50, 'snacks', false, true);

-- 3. Insert Drinks (Flavors only)
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Taro Milktea', 'Classic Taro flavored milktea', 39, 'drinks', false, true),
  ('Matcha Milktea', 'Authentic Matcha flavored milktea', 39, 'drinks', false, true),
  ('Okinawa Milktea', 'Rich Okinawa brown sugar milktea', 39, 'drinks', false, true),
  ('Wintermelon Milktea', 'Refreshing Wintermelon flavored milktea', 39, 'drinks', true, true),
  ('Oreo Milktea', 'Milktea with crushed Oreo cookies', 39, 'drinks', true, true),
  ('White Bunny Milktea', 'Creamy White Bunny candy flavored milktea', 39, 'drinks', false, true),
  ('Mango Cheesecake Milktea', 'Indulgent Mango Cheesecake flavored milktea', 39, 'drinks', false, true),
  ('Dark Choco Milktea', 'Rich and intense Dark Chocolate milktea', 40, 'drinks', false, true),
  ('Hazelnut Milktea', 'Nutty Hazelnut flavored milktea', 42, 'drinks', false, true),
  ('Red Velvet Milktea', 'Velvety Red Velvet flavored milktea', 42, 'drinks', false, true),
  ('Salted Caramel Milktea', 'Sweet and salty Caramel flavored milktea', 44, 'drinks', false, true),
  ('Lychee Fruit Tea', 'Refreshing Lychee flavored fruit tea', 29, 'drinks', false, true),
  ('Blue Lemonade', 'Cooling Blue Lemonade', 29, 'drinks', false, true),
  ('Green Apple Fruit Tea', 'Crisp Green Apple flavored fruit tea', 29, 'drinks', false, true),
  ('Strawberry Fruit Tea', 'Sweet Strawberry flavored fruit tea', 30, 'drinks', false, true),
  ('Blueberry Fruit Tea', 'Tart Blueberry flavored fruit tea', 32, 'drinks', false, true);

-- 4. Add Size Variations for all Drinks (Small/Medium/Large)
-- Small is +0 because base_price is already set to the Small price.
INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Small', 0 FROM menu_items WHERE category = 'drinks';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Medium', 10 FROM menu_items WHERE category = 'drinks';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Large', 20 FROM menu_items WHERE category = 'drinks';

-- 5. Add Add-ons
-- Snack Add-ons (Sauces)
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Garlic sauce sweet', 5, 'Extras' FROM menu_items WHERE category = 'snacks';

INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Garlic sauce spicy', 5, 'Extras' FROM menu_items WHERE category = 'snacks';

INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Cheese sauce', 5, 'Extras' FROM menu_items WHERE category = 'snacks';

-- Drink Add-ons (Toppings)
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Cream cheese', 15, 'Add-ons' FROM menu_items WHERE category = 'drinks';

INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Oreo Bits', 15, 'Add-ons' FROM menu_items WHERE category = 'drinks';

INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Pearl', 10, 'Add-ons' FROM menu_items WHERE category = 'drinks';

INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Nata', 10, 'Add-ons' FROM menu_items WHERE category = 'drinks';
