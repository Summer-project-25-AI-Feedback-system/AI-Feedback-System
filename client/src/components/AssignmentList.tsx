import { useEffect, useState } from "react";
import { fetchAssignments } from "../../../server/AssignmentsService";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAssignments();
      setAssignments(data);
    };
    load();
  }, []);

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((a) => (
          <li key={a.id}>
            {a.title} (due: {a.due_date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
