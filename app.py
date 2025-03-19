from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'

users = {}

@app.route('/')
def index():
    if 'username' in session:
        return render_template('index.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = users.get(username)
        
        if user and check_password_hash(user['password'], password):
            session['username'] = username
            return redirect(url_for('index'))
        
        return "Invalid credentials"
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username in users:
            return "User already exists"
        
        users[username] = {'password': generate_password_hash(password)}
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    event_name = data.get('eventName')
    event_date = data.get('eventDate')
    event_time = data.get('eventTime')
    event_venue = data.get('eventVenue')
    event_budget = data.get('eventBudget')
    num_seats = data.get('numSeats')
    guest_names = data.get('guestNames')
    
    response = {
        "message": "Your event has been successfully registered!",
        "eventDetails": {
            "eventName": event_name,
            "eventDate": event_date,
            "eventTime": event_time,
            "eventVenue": event_venue,
            "eventBudget": event_budget,
            "numSeats": num_seats,
            "guestNames": guest_names
        }
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)