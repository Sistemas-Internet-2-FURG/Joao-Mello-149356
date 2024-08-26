import psycopg2
con = psycopg2.connect(host='localhost', database='autos', user='autos-user', password='autos-pass')
cur = con.cursor()

def get_cars(filter_value=None, filter_type=None):
    query = """SELECT car.id, car.name, value, color, max_speed, image_url, flag_url, app_user.name as added_by_user_name, app_user.id as added_by_user_id FROM car 
    join country on car.country_id = country.id 
    join app_user on car.added_by_user_id = app_user.id"""

    # This is used to filter cars by country or name
    if filter_type == "country" and filter_value:
        query += f" WHERE unaccent(country.name) ILIKE unaccent('%{filter_value}%')"
    elif filter_type == "name" and filter_value:
        query += f" WHERE unaccent(car.name) ILIKE unaccent('%{filter_value}%')"
    
    cur.execute(query)
    return cur.fetchall()


def get_car(id):
    query = f"""SELECT car.id as car_id, car.name, value, color, max_speed, image_url, country.id as contry_id, country.name as country_name, app_user.id as added_by_user_id FROM car 
    join country on car.country_id = country.id
    join app_user on car.added_by_user_id = app_user.id
    WHERE car.id = '{id}'"""
    cur.execute(query)
    return cur.fetchone()


def get_countries():
    query = "SELECT id, name FROM country;"
    cur.execute(query)
    return cur.fetchall()

def get_user_by_email(email):
    query = f"SELECT id FROM app_user WHERE email = '{email}'"
    cur.execute(query)
    result = cur.fetchone()
    return result[0] if result is not None else None

def add_car_fn(name, value, color, max_speed, image_url, country_id, added_by_user_id):
    query = f"""INSERT INTO car (id, name, value, color, max_speed, image_url, country_id, added_by_user_id) 
    VALUES (uuid_generate_v4(), '{name}', '{value}', '{color}', '{max_speed}', '{image_url}', '{country_id}', '{added_by_user_id}')"""
    cur.execute(query)
    con.commit()

def put_car_fn(id, name, value, color, max_speed, image_url, country_id, added_by_user_id):
    query = f"""UPDATE car SET name='{name}', value='{value}', color='{color}', max_speed='{max_speed}', image_url='{image_url}', country_id='{country_id}', added_by_user_id='{added_by_user_id}' 
    WHERE id='{id}'"""
    cur.execute(query)
    con.commit()

def delete_car_fn(id):
    query = f"DELETE FROM car WHERE id='{id}'"
    cur.execute(query)
    con.commit()

def add_user(name, email):
    query = f"INSERT INTO app_user (id, name, email) VALUES (uuid_generate_v4(), '{name}', '{email}')"
    cur.execute(query)
    con.commit() 

def put_user(name, email):
    query = f"UPDATE app_user SET name='{name}' WHERE email='{email}'"
    cur.execute(query)
    con.commit() 