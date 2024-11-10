import locale
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

def map_cars(cars):
    return list(map(__map_car, cars))

def map_car_simple(car):
    return {
        "id": car[0],
        "name": car[1],
        "value": __float_to_currency(car[2]),
        "color": car[3],
        "max_speed": car[4],
        "image_url": car[5],
        "country_id": car[6],
        "country_name": car[7],
        "added_by_user_id": car[8],
    }

def map_countries(countries):
    return list(map(map_country, countries))

def map_country(country):
    return {
        "id": country[0],
        "name": country[1],
    }

def currency_to_float(value):
    amount = value.split(" ")[1]
    return float(amount.replace(".", "").replace(",", "")) * 1e-2


# Functions used only within this module
def __map_car(car):
    return {
        "id": car[0],
        "name": car[1],
        "value": __float_to_currency(car[2]),
        "color": car[3],
        "max_speed": car[4],
        "image_url": car[5],
        "flag_url": car[6],
        "added_by_user_name": car[7],
        "added_by_user_id": car[8],
    }

def __float_to_currency(value):
    amount, currency = locale.currency(value, grouping=True).split(" ")
    return currency + " " + amount