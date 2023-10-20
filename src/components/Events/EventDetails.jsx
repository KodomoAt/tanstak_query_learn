import {Link, Outlet, useNavigate, useParams} from 'react-router-dom';

import Header from '../Header.jsx';
import {useMutation, useQuery} from "@tanstack/react-query";
import {deleleEvent, fetchEvent, queryClient} from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import {useState} from "react";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import Modal from "../UI/Modal.jsx";


export default function EventDetails() {
    const [isDeleting, setIsDeleting] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    const {data, isPending, isError, error} = useQuery(
        {
            queryKey: ['events', params.id],
            queryFn: ({signal}) => fetchEvent({signal, id: params.id}),
            enabled: true,


        }
    )
    console.log(data)

    const {
        mutate,
        isPending: isPendingDeletion,
        isError: isErrorDeleting,
        error: deleteError
    } =
        useMutation({
            mutationFn: deleleEvent,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['events'], refetchType: 'none'})
                navigate('/events');
            }
        })
    const handleStartDelete = () => {
        setIsDeleting(true);
    };
    const handleStopDelete = () => {
        setIsDeleting(false);
    };
    const handleDelete = async () => {


        mutate({id: params.id})


    }
    let content;
    if (isPending) {
        content = <LoadingIndicator/>
    }

    if (isError) {
        content = error.info?.message || <p>Failed to load event details</p>
    }
    if (data) {
        const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        content = <>

            {data && (<>


                    <header>
                        <h1>{data.title}</h1>
                        <nav>
                            <button onClick={handleStartDelete} disabled={isDeleting}>Delete</button>
                            <Link to="edit">Edit</Link>
                        </nav>
                    </header>
                    <div id="event-details-content">
                        <img src={`http://localhost:3000/${data.image}`} alt=""/>
                        <div id="event-details-info">
                            <div>
                                <p id="event-details-location">{data.location}</p>
                                <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate}</time>
                            </div>
                            <p id="event-details-description">{data.description}</p>
                        </div>
                    </div>

                </>

            )}

        </>
    }
    return (<>
            {isDeleting && (<Modal onClose={handleStopDelete}>
                <p>Are you sure you want to delete this event?</p>
                <div>
                    {isPendingDeletion && <p>Deleting, please wait ...</p>}

                    {!isPendingDeletion && (
                        <>

                            <button onClick={handleStopDelete}>Cancel</button>
                            <button onClick={handleDelete}>Delete</button>

                        </>
                    )}
                </div>

                {isErrorDeleting && <ErrorBlock title='Failed to delete event'
                                                message={deleteError.info?.message || 'Failed to delete event'}/>}
            </Modal>)}

            <Outlet/>
            <Header>
                <Link to="/events" className="nav-item">
                    View all Events
                </Link>
            </Header>
            <article id="event-details">
                {content}
            </article>
        </>
    );
}


