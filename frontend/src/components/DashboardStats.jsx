
function DashboardStats({stats}){
    return(
        <>
         <p>Total Assignments:{stats.total}</p>
      <p>Completed Assignments:{stats.completed}</p>
      <p>Pending Assignments:{stats.pending}</p>
      <p>Low Priority: {stats.low}</p>
      <p>Medium Priority: {stats.medium}</p>
      <p>High Priority: {stats.high}</p>
        </>
    )
}

export default DashboardStats;