from flask import Flask, render_template, request, redirect, session, url_for

from mapper import map_cars, map_countries, map_car_simple, currency_to_float
from database_functions import *

app = Flask(__name__)
app.secret_key = 'BAD_SECRET_KEY'

@app.route("/", methods=["GET"])
def home():
    return redirect(url_for("dashboard"))

@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    if session.get("email") is not None:
        return render_template("index.html", name=session.get("name"), email=session.get("email"), session_id=session.get("session_id"), data=map_cars(get_cars()))
    
    return render_template("index.html", data=map_cars(get_cars()))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.form.get("name") is None or request.form.get("email") is None:
        return render_template("login.html")
    
    maybe_user = get_user_by_email(request.form.get("email"))
    # Persist user on database if not exists
    if maybe_user is None: 
        add_user(request.form.get("name"), request.form.get("email"))
    
    # Update user name based on email
    else: 
        put_user(request.form.get("name"), request.form.get("email"))

    session["name"] = request.form.get("name")
    session["email"] = request.form.get("email")
    session["session_id"] = get_user_by_email(request.form.get("email"))
    return redirect(url_for("dashboard"))


@app.route("/filter_cars", methods=["GET", "POST"])
def filter_cars():
    # Get filters selected by user and persist on template after filter submission
    filter_value = request.form.get('filter')
    filter_type = request.form.get('filter_type', 'country')
    cars = map_cars(get_cars(filter_value, filter_type))
    return render_template("index.html", name=session.get("name"), email=session.get("email"), session_id=session.get("session_id"), data=cars, filter=filter_value, filter_type=filter_type)


@app.route("/add_car", methods=["GET", "POST"])
def add_car():
    # Only users with session can add cars
    if session.get("email") is None:
        return redirect(url_for("login"))
    
    # Return the form template
    if request.form.get('name') is None:
        return render_template("add_car.html", name=session.get("name"), email=session.get("email"), countries=map_countries(get_countries()))

    # Add car to database, binded to current user session
    add_car_fn(
        request.form.get('name'),
        request.form.get('value'),
        request.form.get('color'),
        request.form.get('max_speed'),
        request.form.get('image_url'),
        request.form.get('country_id'),
        session.get("session_id")
    )

    return redirect(url_for("dashboard"))


@app.route("/put_car", methods=["GET", "POST"])
def put_car():
    # Only users with session can add cars
    if session.get("email") is None:
        return redirect(url_for("dashboard"))
    
    # Only user that registerd the car can edit it
    if session.get("session_id") != request.form.get("added_by_user_id"):
        return redirect(url_for("dashboard"))
    
    # Return the form template
    if request.form.get('name') is None:
        car = map_car_simple(get_car(request.form.get("car_id")))
        return render_template("put_car.html", name=session.get("name"), email=session.get("email"), countries=map_countries(get_countries()), car=car)

    # Put car to database, binded to current user session
    # We get values from form. If user has not changed a given field, we overwrite with the database value
    car = map_car_simple(get_car(request.form.get("car_id")))
    
    put_car_fn(
        request.form.get("car_id"),
        request.form.get('name') or car.get("name"),
        request.form.get('value') or currency_to_float(car.get('value')), # car.get('value') return a value to display (R$ 100,00), we need float
        request.form.get('color') or car.get('color'),
        request.form.get('max_speed') or car.get('max_speed'),
        request.form.get('image_url') or car.get('image_url'),
        request.form.get('country_id') or car.get('country_id'),
        request.form.get('country_id') or car.get('country_id'),
    )

    return redirect(url_for("dashboard"))


@app.route("/delete_car", methods=["POST"])
def delete_car():
    # Only users with session can delete cars
    if session.get("email") is None:
        return redirect(url_for("dashboard"))
    
    # Only user that registerd the car can delete it
    if session.get("session_id") != request.form.get('added_by_user_id'):
        return redirect(url_for("dashboard"))
    
    delete_car_fn(request.form.get("car_id"))
    return redirect(url_for("dashboard"))


@app.route('/logout', methods=["POST"])
def logout():
    if session.get("email") is not None:
        del session["name"]
        del session["email"]
        del session["session_id"]

    return redirect(url_for("dashboard"))


if __name__ == "__main__":
    app.run(port=8080, debug=True) 