import psycopg2
con = psycopg2.connect(host='localhost', database='autos', user='autos-user', password='autos-pass')
cur = con.cursor()

sql = """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

CREATE TABLE country (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    flag_url VARCHAR(255)
);

CREATE TABLE app_user (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE car (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value FLOAT,
    color VARCHAR(50),
    max_speed INT,
    image_url VARCHAR(255),
    country_id UUID REFERENCES country(id) ON DELETE SET NULL,
    added_by_user_id UUID REFERENCES app_user(id) ON DELETE SET NULL
);

ALTER TABLE car
ADD CONSTRAINT fk_country
FOREIGN KEY (country_id) REFERENCES country(id);

ALTER TABLE car
ADD CONSTRAINT fk_user
FOREIGN KEY (added_by_user_id) REFERENCES app_user(id);

INSERT INTO country (id, name, flag_url)
VALUES
  (uuid_generate_v4(), 'France', 'https://t4.ftcdn.net/jpg/00/06/74/37/240_F_6743715_44KH68A8c3bO3qr7c6SGlhFLjrW388q3.jpg'),
  (uuid_generate_v4(), 'Japan', 'https://t4.ftcdn.net/jpg/02/10/66/61/240_F_210666170_frmhgQbLNojl1Yik2GNzdwqQyOKPNuEt.jpg'),
  (uuid_generate_v4(), 'United States', 'https://t4.ftcdn.net/jpg/00/77/99/55/240_F_77995519_0j69tNQChmaopuUdZNufM4BzxzYRMm2C.jpg'),
  (uuid_generate_v4(), 'Italy', 'https://t4.ftcdn.net/jpg/00/06/74/37/240_F_6743756_tY6yHBVlbw560nna2p3BqhLWlNTRmPmV.jpg'),
  (uuid_generate_v4(), 'Germany', 'https://t3.ftcdn.net/jpg/07/36/19/48/240_F_736194869_PuzMlIStKlB8sy11RXUXv0F0DjOzZpKl.jpg'),
  (uuid_generate_v4(), 'England', 'https://t3.ftcdn.net/jpg/01/09/82/46/240_F_109824622_WnGZBpmvQ7UwTMHmlUJMlaMl7tgSNG7j.jpg');

INSERT INTO app_user (id, name, email)
VALUES
  (uuid_generate_v4(), 'João', 'joao@joao.com');

INSERT INTO car (id, name, value, color, max_speed, image_url, country_id, added_by_user_id)
VALUES
  (uuid_generate_v4(), 'Peugeot 208', 10000, 'Preto', 190, 'https://t3.ftcdn.net/jpg/04/40/38/92/240_F_440389241_lB1PbMbt2pGThvjDWSJnMBxoNU7hFT6r.jpg', (SELECT id FROM country WHERE name = 'France'), (SELECT id FROM app_user WHERE email = 'joao@joao.com')),
  (uuid_generate_v4(), 'Toyota Corolla', 180000, 'Branco', 225, 'https://t3.ftcdn.net/jpg/04/26/87/96/240_F_426879648_qdCOvZH2DP0LgOc37FJRfIk0HVv4G47w.jpg', (SELECT id FROM country WHERE name = 'Japan'), (SELECT id FROM app_user WHERE email = 'joao@joao.com')),
  (uuid_generate_v4(), 'Ferrari Enzo', 6500000, 'Vermelho', 385, 'https://t3.ftcdn.net/jpg/02/98/35/82/240_F_298358259_bwYxOvtrqJn7m8dfeYkkoNkusBSYNhep.jpg', (SELECT id FROM country WHERE name = 'Italy'), (SELECT id FROM app_user WHERE email = 'joao@joao.com')),
  (uuid_generate_v4(), 'Sauber Mercedes C9', 15000000, 'Prata', 360, 'https://t3.ftcdn.net/jpg/03/94/40/94/240_F_394409498_MB2oerqSJZhUQtqfe8rQfLl8ffSOB40N.jpg', (SELECT id FROM country WHERE name = 'Germany'), (SELECT id FROM app_user WHERE email = 'joao@joao.com'));
"""

cur.execute(sql)
con.commit()
con.close()