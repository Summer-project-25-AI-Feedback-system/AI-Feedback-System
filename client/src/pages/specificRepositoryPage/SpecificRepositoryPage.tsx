import FilterButton from "../../components/FilterButton" 

export default function SpecificRepositoryPage() {
  return (
    <div><FilterButton buttonText="Filter" items={["Analyzed", "Error", "Missing"]}/> </div>
  )
}
