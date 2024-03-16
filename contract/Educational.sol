// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";


contract EducationalPlatform is AccessControl {
    address public owner;

    uint256 totalCourses;
    uint256 totalStudents;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE"); 
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE"); 


    mapping (address => uint256) public studentRewards;
    mapping (address => bool) public enrolledStudents;

    event CreateCourse(uitn256 indexed courseId, string title, string courseURL, string submitLink, uint256 credit, uint256 reward, bool);
    event CourseEnrolled(address student, uint256 courseId, uint256 rewardEarned);
    event CourseCompleted(address student, uint256 courseId, uint256 courseReward);
    event AssignmentSubmitted(address indexed student, uint256 indexed courseId, string assignmentURL);


    constructor () {
        _setRoleAdmin(STUDENT_ROLE, DEFAULT_ADMIN_ROLE); 
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    struct Course {
        string title;
        string courseURL;
        string SubmitLink;
        uint256 rewards;
        uint256 credits;
        bool isCompleted;
        // owner related
        // blocked

    }

    modifier onlyAdmin () {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "only admin have access");
        _;
    }
    mapping (uint256 => Course) public courses;

    function createCourse(string memory _title, string memory _courseURL, uint256 _credits, uint256 _reward) external {
        string memory submit = '';
        courses[totalCourses++] = Course(_title, _courseURL, submit, _credits, _reward, false);

        emit CreateCourse(totalCourses, _title, _courseURL, submit, _credits, _reward, false);

    }

    function getCoursesDetails(uint256 _index) public view returns(string memory, string memory,
    string memory, uint256, uint256, bool) {
        Course storage course = courses[_index];
        return (
            course.title,
            course.courseURL,
            course.SubmitLink,
            course.rewards,
            course.credits,
            course.isCompleted
        );
    }

    function enrollCourse(uint256 _courseId) external {
        require(!enrolledStudents[msg.sender], "Student is already enrolled in the course");
        require(_courseId <= totalCourses && _courseId > 0, "Invalid Course ID");
        enrolledStudents[msg.sender] = true;
        totalStudents++;

        uint256 createToEarn = courses[_courseId].credits;
        studentRewards[msg.sender] += createToEarn;

        emit CourseEnrolled(msg.sender, _courseId, createToEarn);
    }
    

    function submitAssignment(uint256 _courseId, string memory _assignmentURL) external {
        require(enrolledStudents[msg.sender], "Student is not enrolled in this course");
        require(_courseId <= totalCourses && _courseId > 0, "Invalid course ID");
        require(!courses[_courseId].isCompleted, "Course already completed");

        emit AssignmentSubmitted(msg.sender, _courseId, _assignmentURL);
    }


    function completedCourse(uint256 _courseId) external {
        require(enrolledStudents[msg.sender], "Student is not enrolled in this course");
        require(_courseId <= totalCourses && _courseId > 0, "Invalid course ID");
        require(!courses[_courseId].isCompleted, "Course already completed");

        uint256 rewardEarned = courses[_courseId].rewards;
        studentRewards[msg.sender] += rewardEarned;
        courses[_courseId].isCompleted = true;

        emit CourseCompleted(msg.sender, _courseId, rewardEarned);

    }

    function getStudentCredits() external view returns (uint256) {
        return studentRewards[msg.sender];
    }

    function getCourses() external view returns (Course[] memory) {
        Course[] memory courseList = new Course[](totalCourses);
        for (uint i = 0; i < totalCourses; i++) {
            courseList[i] = courses[i];
        }
        return courseList;
    }


    function getCourseDetails(uint256 _courseId) external view returns (Course memory) {
        require(_courseId <= totalCourses && _courseId > 0, "Invalid course ID");
        return courses[_courseId];
    }


}