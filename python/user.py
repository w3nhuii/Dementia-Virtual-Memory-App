import sqlite3
db = sqlite3.connect('user.sqlite')

db.execute('''CREATE TABLE users(
    id integer PRIMARY KEY AUTOINCREMENT,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    dob text NOT NULL,
    gender text NOT NULL
)''')

cursor = db.cursor()

cursor.execute('''INSERT INTO users(username,email,password,dob,gender) VALUES("admin","admin@gmail.com","admin","13 August 2001","Female")''')


db.commit()
db.close()