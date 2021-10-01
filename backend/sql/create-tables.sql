
CREATE TABLE production_categories (
	category_id INTEGER PRIMARY KEY,
	category_name TEXT NOT NULL
);

CREATE TABLE production_brands (
	brand_id INTEGER PRIMARY KEY,
	brand_name TEXT NOT NULL
);

CREATE TABLE production_products (
	product_id INTEGER PRIMARY KEY,
	product_name TEXT NOT NULL,
	brand_id INTEGER NOT NULL,
	category_id INTEGER NOT NULL,
	model_year SMALLINT NOT NULL,
	list_price NUMERIC NOT NULL
);

CREATE TABLE sales_customers (
	customer_id INTEGER PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	phone TEXT,
	email TEXT NOT NULL,
	street TEXT,
	city TEXT,
	state TEXT,
	zip_code TEXT
);

CREATE TABLE sales_stores (
	store_id INTEGER PRIMARY KEY,
	store_name TEXT NOT NULL,
	phone TEXT,
	email TEXT,
	street TEXT,
	city TEXT,
	state TEXT,
	zip_code TEXT
);

CREATE TABLE sales_staffs (
	staff_id INTEGER PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL,
	phone TEXT,
	active INTEGER NOT NULL,
	store_id INTEGER NOT NULL,
	manager_id INTEGER
);

CREATE TABLE sales_orders (
	order_id INTEGER PRIMARY KEY,
	customer_id INTEGER,
	order_status INTEGER NOT NULL,
	-- Order status: 1 = Pending; 2 = Processing; 3 = Rejected; 4 = Completed
	order_date DATE NOT NULL,
	required_date DATE NOT NULL,
	shipped_date DATE,
	store_id INTEGER NOT NULL,
	staff_id INTEGER NOT NULL
);

CREATE TABLE sales_order_items (
	order_id INTEGER,
	item_id INTEGER,
	product_id INTEGER NOT NULL,
	quantity INTEGER NOT NULL,
	list_price NUMERIC NOT NULL,
	discount NUMERIC NOT NULL
);

CREATE TABLE production_stocks (
	store_id INTEGER,
	product_id INTEGER,
	quantity INTEGER
);