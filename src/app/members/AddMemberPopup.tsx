import AddMember from './components/AddMember';

function AddMemberPopup({ onHandle }: { onHandle: () => void }) {
  return <AddMember onClose={onHandle} />;
}

export default AddMemberPopup;
