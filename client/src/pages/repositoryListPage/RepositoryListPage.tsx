import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "./BasicSearchBar";


export default function RepositoryListPage() {
  return (
    <div className="flex flex-col space-y-20">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between">
          <BasicHeading heading="Your Classroom Repositories"></BasicHeading>
          <div>
            <FilterButton buttonText="Sort By" items={["New", "Old"]}></FilterButton>
          </div>
        </div>
        <BasicSearchBar />
      </div>
      <BasicList />
    </div>
  )
}
