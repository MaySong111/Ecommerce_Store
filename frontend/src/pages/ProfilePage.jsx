import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { name } = useParams();

  
  return (
    <div>
      ProfilePage
      <h1>{name}'s Profile</h1>
    </div>
  );
}
