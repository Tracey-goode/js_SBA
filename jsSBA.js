// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(course, ag, submissions) {
 try {
      if (ag.course_id !== course.id) {
        throw new Error("Assignment group does not match");
      }

      // Assignments due date
      const today = new Date();
      const validAssignments = [];
      for (let i = 0; i < ag.assignments.length; i++) {
        const assignment = ag.assignments[i];
        const dueDate = new Date(assignment.due_at);
  
        if (dueDate <= today && assignment.points_possible > 0) {
          validAssignments.push(assignment);
        }
      }

      const assignmentMap = {};
      for (let i = 0; i < validAssignments.length; i++) {
        const a = validAssignments[i];
        assignmentMap[a.id] = a;
      }

        const learners = {};
  
      for (let i = 0; i < submissions.length; i++) {
        const sub = submissions[i];
        const assignment = assignmentMap[sub.assignment_id];

        if (!assignment) {
          continue;
        }
  
        const dueDate = new Date(assignment.due_at);
        const submittedDate = new Date(sub.submission.submitted_at);

        let score = sub.submission.score;
        if (submittedDate > dueDate) {
          score = score - (assignment.points_possible * 0.1);
        }
  
        if (score < 0) {
          score = 0;
        } 

         const percent = score / assignment.points_possible;

         //if statement for learners dont exist

         if (!learners[sub.learner_id]) {
          learners[sub.learner_id] = {
            id: sub.learner_id,
            totalScore: 0,
            totalPoints: 0
          };
        }

        //assignment score
        learners[sub.learner_id][assignment.id] = Number(percent.toFixed(3));
        
        learners[sub.learner_id].totalScore += score;
        learners[sub.learner_id].totalPoints += assignment.points_possible;
      }
      //avgs, list objects
        const result = [];
      for (let learnerId in learners) {
        const learner = learners[learnerId];
        const avgScore = learner.totalScore / learner.totalPoints;
  
        const learnerResult = {};
        learnerResult.id = learner.id;
        learnerResult.avg = Number(avgScore.toFixed(3));

        //assignment scores AFTER id and avg
        const keys = Object.keys(learner)
          .filter(k => !["id", "totalScore", "totalPoints"].includes(k))
          .sort((a, b) => a - b); // Optional: ensure assignments like 1, 2, 3 are in order

        for (let key of keys) {
          learnerResult[key] = learner[key];
        }

        
        result.push(learnerResult);
      }
      result.sort((a,b) => a.id - b.id);

    return result;

    } catch (error) {
      console.error("There was a problem:", error.message);
      return [];
    }
    
  }
 const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);









// Your goal is to analyze and transform this data such that the output of your program 
// is an array of objects, each containing the following information in the following format:


// const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];