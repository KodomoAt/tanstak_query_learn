import {Link, useNavigate} from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import {useMutation, useQuery} from "@tanstack/react-query";
import {createNewEvent, queryClient} from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
    const navigate = useNavigate();
    //mutate permet de déclencher la mutation car contraireent à useQuery elle n'est pas déclenché automatiquement
    const {mutate, isPending, isError, error} = useMutation({
        //mutationKey: [], PAS OBLIGATOIRE CAR LE BUT DE LA MUTATION EST DE METTRE A JOUR DES DONNÉES CÔTE SERVEUR
        mutationFn: createNewEvent,
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey: ['events']}) // Indique à React Query que certaines données ont changé et qu'il faut refetcher celles-ci
            navigate("/events")
        }
    })

    function handleSubmit(formData) {
        mutate({event: formData});

    }


    return (
        <Modal onClose={() => navigate('../')}>
            <EventForm onSubmit={handleSubmit}>
                {isPending && 'Submitting...'}
                {!isPending && (
                    <>
                        <Link to="../" className="button-text">
                            Cancel
                        </Link>
                        <button type="submit" className="button">
                            Create
                        </button>
                    </>
                )}

            </EventForm>
            {isError && <ErrorBlock title={"Failed to create event"}
                                    message={error.info?.message || "Failed to create event. Please check your inputs and try again."}/>}
        </Modal>
    );
}
