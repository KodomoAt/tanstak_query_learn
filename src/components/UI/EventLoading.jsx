
import {Link} from "react-router-dom";
export const EventLoading = () => {
  return    <article className="event-item loading">
      <div className="event-item-image"></div>
      <div className="event-item-content">
          <div>
              <h2></h2>
              <p className="event-item-date"></p>
              <p className="event-item-location"></p>
          </div>
          <p>
              {/*<Link to={`/events/${event.id}`} className="button">*/}
              {/*    View Details*/}
              {/*</Link>*/}
          </p>
      </div>
  </article>
};