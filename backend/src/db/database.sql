DROP DATABASE IF EXISTS wish_at_your_own_expense;
CREATE DATABASE wish_at_your_own_expense;

CREATE TABLE admins (
    admin_id SERIAL NOT NULL PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    admin_email VARCHAR(50) NOT NULL,
    admin_hash VARCHAR(60) NOT NULL
);

CREATE TABLE users (
    user_id SERIAL NOT NULL PRIMARY KEY,
    user_is_active BOOLEAN DEFAULT TRUE,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(50) NOT NULL,
    user_hash VARCHAR(60) NOT NULL
);

CREATE TABLE budgets (
    budget_id SERIAL NOT NULL PRIMARY KEY,
    budget_amt DECIMAL(10,2),
    budget_mth SMALLINT,
    budget_year SMALLINT
);

CREATE TABLE user_budgets (
    budget_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_budget FOREIGN KEY(budget_id) REFERENCES budgets(budget_id),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE expense_category (
    expense_category VARCHAR(20) PRIMARY KEY
);

INSERT INTO expense_category VALUES 
    ('FOOD'),
    ('TRANSPORT'),
    ('RECREATION'),
    ('HOUSING'),
    ('HEALTH'),
    ('GIVING'),
    ('OTHERS');

CREATE TABLE wishlist_status (
    wishlist_status VARCHAR(30) PRIMARY KEY
);

INSERT INTO wishlist_status VALUES
    ('PURCHASED'),
    ('UNPURCHASED');

CREATE TABLE expenses (
    expense_id SERIAL NOT NULL PRIMARY KEY,
    expense_date DATE,
    expense_item VARCHAR(50),
    expense_category VARCHAR(20),
    expense_amt DECIMAL(10,2),
    user_id INT NOT NULL,
    CONSTRAINT fk_expense_category FOREIGN KEY(expense_category) REFERENCES expense_category(expense_category),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE wishlists (
    wishlist_id SERIAL NOT NULL PRIMARY KEY,
    wishlist_position SMALLINT,
    wishlist_item VARCHAR(50),
    wishlist_cost DECIMAL(10,2),
    wishlist_store VARCHAR(300),
    wishlist_status VARCHAR(30),
    user_id INT NOT NULL,
    CONSTRAINT fk_wishlist_status FOREIGN KEY(wishlist_status) REFERENCES wishlist_status(wishlist_status),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);

INSERT INTO admins (admin_name, admin_email, admin_hash) VALUES 
('Admin', 'admin@mail.com', '$2a$12$BDZr1BZ13aWkYMqFxy4JR.W1eC2zrFEqv1YpQhcfNuYW86jph7L2.'),
('Admin One', 'adminone@mail.com', '$2a$12$pyA9UwYu1hh8ZiLuB.ZzbeWG43yVcfbQGWIpJE7DIG8JxEHR9Bbei'),
('Admin Two', 'admintwo@mail.com', '$2a$12$H0iqgu/27HFA08/w0nt9GeRr1W6DC1WNY63Ex1P2RAqKsOJOCNOtq');
INSERT INTO users (user_name, user_email, user_hash) VALUES 
('User', 'user@mail.com', '$2a$12$eJLAQCEQaQAMUOWMMtjna.71lMkIBQWNZrF/aFKkx794rL1nQQsoS'),
('User One', 'userone@mail.com', '$2a$12$h90hW0a6EXpM9gzGmR1ozeOFVnV96sw5xtzCN5wqOhiEaV6jeOuK6'),
('User Two', 'usertwo@mail.com', '$2a$12$0W.OnFdY00PThOrvmBCUm.gp.dVqyprFpDhmBew4qby1Q6uCK3tZu');
INSERT INTO budgets (budget_amt, budget_mth, budget_year) VALUES
(300, 4, 2024),
(300, 5, 2024),
(300, 6, 2024);
INSERT INTO user_budgets (budget_id, user_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(2, 2),
(3, 2),
(1, 3),
(2, 3),
(3, 3);
INSERT INTO expenses (expense_date, expense_item, expense_category, expense_amt, user_id) VALUES
('2024-04-07', 'Mon to fri lunch', 'FOOD', 50, 1),
('2024-04-08', 'Grab to office', 'TRANSPORT', 20, 1),
('2024-04-08', 'Visit to doctor', 'HEALTH', 20, 1),
('2024-04-07', 'Movie Ticket', 'RECREATION', 10, 2),
('2024-04-07', 'Buffet dinner', 'FOOD', 100, 3),
('2024-05-01', 'Groceries', 'FOOD', 50, 1),
('2024-05-02', 'Monthly public transport', 'TRANSPORT', 100, 1);
INSERT INTO wishlists (wishlist_position, wishlist_item, wishlist_cost, wishlist_store, wishlist_status, user_id) VALUES
(1, 'Apple ipad mini', 997.20, 'https://www.apple.com/sg/shop/buy-ipad/ipad-mini/256gb-pink-wifi', 'UNPURCHASED', 1),
(2, 'Pillow', 100, 'Tangs department store', 'UNPURCHASED', 1),
(3, 'Snoopy MoonSwatch', 430, 'https://www.swatch.com/en-sg/bioceramic-moonswatch/mission-to-the-moonphase/full-moon.html', 'UNPURCHASED', 1),
(4, 'Water Bottle', 30, 'Shopee', 'PURCHASED', 1),
(1, 'Windows Laptop', 1500, 'Best Denki', 'UNPURCHASED', 2),
(1, 'Water Bottle', 30, 'Shopee', 'PURCHASED', 3);