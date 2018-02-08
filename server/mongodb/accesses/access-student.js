const Student = require('../models/student');
const Utils = require('./utils-accesses');
const AccessUser = require('./access-user');
const TYPE = "Student";

class AccessStudent {
    constructor() {
        this.getStudentById = AccessUser.getUserById;
        this.getStudentByEmail = AccessUser.getUserByEmail;
        this.addStudent = addStudent;
        this.addResume = addResume;
        this.getNumberOfStudentsPerCourse = getNumberOfStudentsPerCourse;
        this.getNumberOfStudents = getNumberOfStudents;
        this.getAreasOfInterest = getAreasOfInterest;
        this.getStudents = getStudents;
    }

    /*Can we just define
    * let AccessStudent =   {
    *     getStudentByID: function {...}
    *
    *
    * What's better?
    * */
}

let access_student = module.exports = exports = new AccessStudent();

/********************************
 *  C.R.U.D. FUNCTIONS
 *******************************/

function addStudent(name, email, courses, callback) {
    let newUser = new Student({
        name: name,
        email: email,
        courses: courses
    });

    newUser.save(callback);
    return newUser;
}


function addResume(id, resume, callback) {
    let conditions = {_id: id};
    let update = { resume: resume };
    let options = { new: true };
    Student.update(conditions, update, options, callback);
}

function getNumberOfStudents(callback) {
    Student.count(callback);
}

function getNumberOfStudentsPerCourse(callback) {
    Student.aggregate([ {$group : { _id : '$courses', count : {$sum : 1}} }], (err, result) => {
        let courses = {};

        if (err || result === null) callback(err, result);
        else {
            for (index in result) {
                let arr = result[index]._id;
                let arrCount = result[index].count;
                for (arrInd in arr) {
                    let key = arr[arrInd].replace(' - Alameda', '').replace(' - Taguspark', '');
                    if (courses[key] !== undefined)
                        courses[key] += arrCount;
                    else
                        courses[key] = arrCount;
                }
            }
            callback(err, courses);
        }
    });
}


function getAreasOfInterest(student, callback) {
    let hardMappingCourseArea = {
        "SAD": ["Machine Learning", "Knowledge discovery"],
        // Course : Areas
        // A Decidir com os professores
    }

    let areaCount = {
        "Machine Learning": 0,
        "Knowledge discovery": 0
    };

    let courses = student.courses;
    for (var i in courses) {
        areasOfCourse = hardMappingCourseArea[courses[i]];
        for (var j in areasOfCourse)
            areaCount[areasOfCourse[j]] = areaCount[areasOfCourse[j]] + 1;
    }

    callback(areaCount);
}

function getStudents(callback) {
    Student.find({}, callback);
}