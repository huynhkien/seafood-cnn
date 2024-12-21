
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const withBaseComponents = (Component) => (props) => {
  const navigate = useNavigate(false);
  const dispatch = useDispatch();
  const params = useParams();

  return <Component {...props} navigate={navigate} dispatch={dispatch} params={params} />;
}

export default withBaseComponents;
