import User from './User.js';
import Student from './Student.js';
import Program from './Program.js';
import Course from './Course.js';
import Exam from './Exam.js';
import StudentExam from './StudentExam.js';
import MonitoringLog from './MonitoringLog.js';
import Incident from './Incident.js';
import Department from './Department.js';
import Report from './Report.js';

// Department Associations
Department.hasMany(User, {
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
  as: 'departmentStaff'  // Changed from departmentUsers
});
User.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'staffDepartment'  // Changed from userDepartment
});

Department.hasMany(Program, {
  foreignKey: 'department_id',
  onDelete: 'CASCADE',
  as: 'departmentPrograms'
});
Program.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'programDepartment'
});

// Program Associations
Program.hasMany(Course, {
  foreignKey: 'program_id',
  onDelete: 'CASCADE',
  as: 'programOfferedCourses'  // Changed from programCourses
});
Course.belongsTo(Program, {
  foreignKey: 'program_id',
  as: 'courseProgram'
});

Program.hasMany(Student, {
  foreignKey: 'program_id',
  onDelete: 'CASCADE',
  as: 'programEnrolledStudents'  // Changed from programStudents
});
Student.belongsTo(Program, {
  foreignKey: 'program_id',
  as: 'studentProgram'
});

// User Associations
User.hasOne(Student, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'studentProfile'  // Changed from userStudent
});
Student.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'userAccount'  // Changed from studentUser
});

User.hasMany(Course, {
  foreignKey: 'instructor_id',
  onDelete: 'CASCADE',
  as: 'instructedCourses'
});
Course.belongsTo(User, {
  foreignKey: 'instructor_id',
  as: 'courseInstructor'
});

User.hasMany(Report, {
  foreignKey: 'generated_by',
  onDelete: 'CASCADE',
  as: 'authoredReports'  // Changed from generatedReports
});
Report.belongsTo(User, {
  foreignKey: 'generated_by',
  as: 'reportAuthor'  // Changed from reportGenerator
});

// Course Associations
Course.hasMany(Exam, {
  foreignKey: 'course_id',
  onDelete: 'CASCADE',
  as: 'courseExams'
});
Exam.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'examCourse'
});

// Exam Associations
Exam.hasMany(Report, {
  foreignKey: 'exam_id',
  onDelete: 'CASCADE',
  as: 'examRelatedReports'  // Changed from examReports
});
Report.belongsTo(Exam, {
  foreignKey: 'exam_id',
  as: 'reportExam'
});

Exam.hasMany(StudentExam, {
  foreignKey: 'exam_id',
  onDelete: 'CASCADE',
  as: 'examRegistrations'  // Changed from examStudentExams
});
StudentExam.belongsTo(Exam, {
  foreignKey: 'exam_id',
  as: 'registrationExam'  // Changed from studentExamExam
});

// Student Associations
Student.hasMany(StudentExam, {
  foreignKey: 'student_id',
  onDelete: 'CASCADE',
  as: 'studentExamRegistrations'  // Changed from studentStudentExams
});
StudentExam.belongsTo(Student, {
  foreignKey: 'student_id',
  as: 'registrationStudent'  // Changed from studentExamStudent
});

// StudentExam Associations
StudentExam.hasMany(MonitoringLog, {
  foreignKey: 'student_exam_id',
  onDelete: 'CASCADE',
  as: 'registrationMonitoringLogs'  // Changed from studentExamMonitoringLogs
});
MonitoringLog.belongsTo(StudentExam, {
  foreignKey: 'student_exam_id',
  as: 'monitoringLogRegistration'  // Changed from monitoringLogStudentExam
});

StudentExam.hasMany(Incident, {
  foreignKey: 'student_exam_id',
  onDelete: 'CASCADE',
  as: 'registrationIncidents'  // Changed from studentExamIncidents
});
Incident.belongsTo(StudentExam, {
  foreignKey: 'student_exam_id',
  as: 'incidentRegistration'  // Changed from incidentStudentExam
});

export {
  User,
  Student,
  Program,
  Course,
  Exam,
  StudentExam,
  MonitoringLog,
  Incident,
  Department,
  Report
};