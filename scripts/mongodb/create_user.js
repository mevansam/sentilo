// This script needs to be executed as the database admin

conn = new Mongo();

// Create role in "admin" database with execute privileges on any function
// https://www.claudiokuenzler.com/blog/555/allow-mongodb-user-execute-command-eval-mongodb-3.x#.WHHxBrZ97MU

db = conn.getDB("admin");

if (db.system.users.find({user: 'root'}).count()==0) { 
    db.createUser( { 
	user: "root", 
	pwd: "sentilo", 
	roles: [ {
            "role" : "readWriteAnyDatabase",
            "db" : "admin"
        }, {
            "role" : "userAdminAnyDatabase",
            "db" : "admin"
        }, {
            "role" : "dbAdminAnyDatabase",
            "db" : "admin"
        }, {
            "role" : "clusterAdmin",
            "db" : "admin"
        } ]
    } )
}
if (db.system.roles.find({role: 'executeFunctions'}).count()==0) { 
    db.createRole( { 
        role: "executeFunctions", 
        privileges: [ { 
            resource: { 
                anyResource: true 
            }, 
            actions: [ 
                "anyAction" 
            ] 
        } ], 
        roles: [] 
    } )
}

// Create user in a database named "sentilo"

db = conn.getDB("sentilo");

if (db.system.users.find({user: 'sentilo'}).count()==0) { 
    db.createUser( { 
        user: "sentilo",
        pwd: "sentilo",
        roles: [ { 
            role: "dbAdmin", db: "sentilo" 
        }, { 
            role: "dbOwner", db: "sentilo" 
        }, { 
            role: "readWrite", db: "sentilo" 
        }, { 
            role: "executeFunctions", db: "admin" 
        } ] 
    } )
} else {
    db.grantRolesToUser("sentilo", [ { role: "executeFunctions", db: "admin" } ])
}
