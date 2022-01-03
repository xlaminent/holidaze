import PropTypes from "prop-types";

function RoomExtras({list}) {
    return (<>
         {list.map(function (accommodations) {
             return (
                 <li key={accommodations.item_slug}>
                    {accommodations.item_quantity <= 1 ? ` ${accommodations.item_slug}` : `${accommodations.item_quantity} ${accommodations.item_slug}`}
                 </li>
             );
         })}
    </>);
}

RoomExtras.propTypes = {
	list: PropTypes.arrayOf(PropTypes.object),
};

export default RoomExtras;
