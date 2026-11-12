import { useContext } from "react";
import { StudentCourseContext } from "../context/StudentCourseContext";

export function useStudentCourses(){
    const context=useContext(StudentCourseContext);

    if(!context){
        throw new Error(
            'useStudentCourses must be used inside StudentCourseProvider'
        );
    }
    return context;
}