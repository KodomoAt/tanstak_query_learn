import {Link, redirect, useNavigate, useNavigation, useParams, useSubmit} from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchEvent, queryClient, updateEvent} from "../../utils/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
    const navigate = useNavigate();
    const {state} = useNavigation();
    const params = useParams();
    const submit = useSubmit();

    const {data, isError, error} = useQuery(
        {
            queryKey: ['events', params.id],
            queryFn: ({signal}) => fetchEvent({signal, id: params.id}),
            staleTime: 5000


        }
    )

    // const {mutate, isError: updateIsError, error: updateError} = useMutation({
    //     mutationFn: updateEvent,
    //     onMutate: async (data) => {
    //         await queryClient.cancelQueries({queryKey: ['events', params.id]});
    //         const previousEvent = queryClient.getQueryData(['events', params.id]);
    //         queryClient.setQueryData(['events', params.id], {
    //             ...data.event,
    //             isPending: true
    //         });
    //         return {previousEvent}
    //     },
    //     onError: (error, variables, context) => {
    //         queryClient.setQueryData(['events', params.id], context.previousEvent);
    //     },
    //     onSettled: () => {
    //         queryClient.invalidateQueries({queryKey: ['events', params.id]});
    //     }
    //
    //
    // })

    function handleSubmit(formData) {
      submit(formData, {method:"PUT"})

    }

    function handleClose() {
        navigate('../');
    }


    let content;


    if (isError) {
        content = <>
            <ErrorBlock title={"Failed to load event"} message={error.info?.message || "Faile to load event."}/>
            <div className="form-actions">
                <Link to={"../"}>Okay</Link>
            </div>
        </>
    }

    if (data) {
        content = <EventForm inputData={data} onSubmit={handleSubmit}>
            {state === 'submitting' ? <p>Sending data ...</p> : (<Link to="../" className="button-text">
                Cancel
            </Link>)}

            <button type="submit" className="button">
                Update
            </button>
        </EventForm>
    }

    return (
        <>


            <Modal onClose={handleClose}>
                {content}
            </Modal>


        </>
    );
}


export function loader({request, params}) {

    return queryClient.fetchQuery({
        queryKey: ['events', params.id],
        queryFn: ({signal}) => fetchEvent({signal, id:params.id})
    })
}

export async function  action({request, params}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    await updateEvent({id: params.id, event: data});
    await queryClient.invalidateQueries({queryKey: ['events', params.id]});
    return redirect('../')

}