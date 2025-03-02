import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
type Credentials = {
    // Define the shape of the credentials object here, e.g.:
    username?: string;
    password?: string;
};
function AddMemberPopup({ onHandle }: any) {
    const [basicinfo, setBasicinfo] = useState(true);
    const [address, setAddress] = useState(false);
    const [payout, setPayout] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [credgot, setCredgot] = useState<Credentials | null>(null);

    const [basicInfoFields, setBasicInfoFields] = useState({
        name: '',
        phone_number: '',
        email: '',
        aadhar_no: '',
        pan_no: '',
        role: ''
    });

    const [addressFields, setAddressFields] = useState({
        street_or_house_no: '',
        landmark: '',
        address_one: '',
        address_two: '',
        city: '',
        state: '',
        country: '',
        pin_code: '',
    });

    const [payoutFields, setPayoutFields] = useState({
        account_name: '',
        account_number: '',
        ifsc_code: '',
        branch_name: '',
        upiid: '',
    });

    const [isNextEnabled1, setIsNextEnabled1] = useState(false);
    const [isNextEnabled2, setIsNextEnabled2] = useState(false);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    useEffect(() => {
        const isBasicInfoComplete = Object.values(basicInfoFields).every(field => field.trim() !== '');
        setIsNextEnabled1(isBasicInfoComplete);
    }, [basicInfoFields]);

    useEffect(() => {
        const isAddressComplete = Object.entries(addressFields).every(([key, value]) => {
            if (key === 'landmark') return true; // Allow landmark to be empty
            return value.trim() !== ''; // Ensure all other fields are filled
        });
        setIsNextEnabled2(isAddressComplete);
    }, [addressFields]);
    

    useEffect(() => {
        const isPayoutComplete = Object.values(payoutFields).every(field => field.trim() !== '');
        setIsSubmitEnabled(isPayoutComplete);
    }, [payoutFields]);

    function handleNextBtn1() {
        setBasicinfo(false);
        setAddress(true);
    }

    function handleNextBtn2() {
        setAddress(false);
        setPayout(true);
    }

    function handleBackBtn1() {
        setBasicinfo(true);
        setAddress(false);
    }

    function handleBackBtn2() {
        setPayout(false);
        setAddress(true);
    }

    const handleChangeBasicInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBasicInfoFields({
            ...basicInfoFields,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressFields({
            ...addressFields,
            [e.target.name]: e.target.value,
        });
    };
    const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBasicInfoFields({
            ...basicInfoFields,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangePayout = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayoutFields({
            ...payoutFields,
            [e.target.name]: e.target.value,
        });
    };



    const handleSubmit = async () => {
        setIsSubmitted(true);
        setPayout(false);
        try {
            const response = await axios.post('/api/members/register', {
                basicInfoFields,
                addressFields,
                payoutFields
            });
            if (response.status === 200) {
                setIsSubmitted(false);
                setIsRegistered(true);
                setCredgot(response.data);
            }
        } catch (error) {
            alert('An error occurred while registering the member.');
            onHandle();
        }
    };

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[75vh] bg-white z-50 rounded border border-black flex flex-col gap-5 overflow-y-auto">
            <div className='flex justify-between items-center px-10 py-5 h-[4rem] border-b-[1px] border-gray-300 sticky top-0 left-0 bg-white'>
                {basicinfo ? (
                    <h2 className="text-2xl font-bold text-center">Add Member</h2>
                ) : address ? (
                    <h2 className="text-2xl font-bold text-center">Add Address</h2>
                ) : payout ? (
                    <h2 className="text-2xl font-bold text-center">Add Payout Details</h2>
                ) : isSubmitted ? (
                    <h2 className="text-2xl font-bold text-center">Progress...</h2>
                ):(
                    <h2 className="text-2xl font-bold text-center">Status</h2>
                )}
                <FaTimes onClick={onHandle} className='text-2xl' />
            </div>
            <div className='px-10 flex flex-col gap-5 py-5'>
                {basicinfo && (
                    <>
                        <input
                            type="text"
                            name='name'
                            placeholder='Enter Full Name'
                            value={basicInfoFields.name}
                            onChange={handleChangeBasicInfo}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="number"
                            name='phone_number'
                            placeholder='Enter Phone Number'
                            value={basicInfoFields.phone_number}
                            onChange={handleChangeBasicInfo}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="email"
                            name='email'
                            placeholder='Enter Email'
                            value={basicInfoFields.email}
                            onChange={handleChangeBasicInfo}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="number"
                            name='aadhar_no'
                            placeholder='Enter Aadhar Number'
                            value={basicInfoFields.aadhar_no}
                            onChange={handleChangeBasicInfo}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='pan_no'
                            placeholder='Enter PAN Number'
                            value={basicInfoFields.pan_no}
                            onChange={handleChangeBasicInfo}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <hr />
                        <select
                            name="role"
                            value={basicInfoFields.role}
                            onChange={handleChangeRole}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="waiter">Waiter</option>
                            <option value="chef">Chef</option>
                            <option value="washer">Washer</option>
                        </select>

                        <div className='flex justify-end'>
                            <button className={`px-7 py-3 text-white font-semibold rounded ${isNextEnabled1 ? 'bg-primary' : 'bg-[#506b87] cursor-not-allowed'}`} onClick={handleNextBtn1} disabled={!isNextEnabled1}>Next</button>
                        </div>
                    </>
                )}

                {address && (
                    <>
                        <input
                            type="text"
                            name='street_or_house_no'
                            placeholder='Enter Street/House no.'
                            value={addressFields.street_or_house_no}
                            onChange={handleChangeAddress}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='landmark'
                            placeholder='Enter Landmark'
                            value={addressFields.landmark}
                            onChange={handleChangeAddress}
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='address_one'
                            placeholder='Enter Address 1'
                            value={addressFields.address_one}
                            onChange={handleChangeAddress}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='address_two'
                            placeholder='Enter Address 2'
                            value={addressFields.address_two}
                            onChange={handleChangeAddress}
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='city'
                            placeholder='Enter City'
                            value={addressFields.city}
                            onChange={handleChangeAddress}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='state'
                            placeholder='Enter State'
                            value={addressFields.state}
                            onChange={handleChangeAddress}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='country'
                            placeholder='Enter Country'
                            value={addressFields.country}
                            onChange={handleChangeAddress}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='pin_code'
                            placeholder='Enter Pin Code'
                            value={addressFields.pin_code}
                            onChange={handleChangeAddress}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <div className='flex justify-between'>
                            <button className='bg-primary px-7 py-3 text-white font-semibold rounded' onClick={handleBackBtn1}>Back</button>
                            <button className={`px-7 py-3 text-white font-semibold rounded ${isNextEnabled2 ? 'bg-primary' : 'bg-[#506b87] cursor-not-allowed'}`} onClick={handleNextBtn2} disabled={!isNextEnabled2}>Next</button>
                        </div>
                    </>
                )}

                {payout && (
                    <>
                        <input
                            type="text"
                            name='account_name'
                            placeholder='Enter Account Name'
                            value={payoutFields.account_name}
                            onChange={handleChangePayout}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="number"
                            name='account_number'
                            placeholder='Enter Account Number'
                            value={payoutFields.account_number}
                            onChange={handleChangePayout}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='ifsc_code'
                            placeholder='Enter IFSC Code'
                            value={payoutFields.ifsc_code}
                            onChange={handleChangePayout}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='branch_name'
                            placeholder='Enter Branch Name'
                            value={payoutFields.branch_name}
                            onChange={handleChangePayout}
                            required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <input
                            type="text"
                            name='upiid'
                            placeholder='Enter UPI ID'
                            value={payoutFields.upiid}
                            onChange={handleChangePayout}
                            // required
                            className='py-2 px-3 border border-gray-300 rounded outline-none'
                        />
                        <div className='flex justify-between'>
                            <button className='bg-primary px-7 py-3 text-white font-semibold rounded' onClick={handleBackBtn2}>Back</button>
                            <button className={`px-7 py-3 text-white font-semibold rounded ${isSubmitEnabled ? 'bg-primary' : 'bg-[#506b87] cursor-not-allowed'}`} onClick={handleSubmit} disabled={!isSubmitEnabled}>Submit</button>
                        </div>
                    </>
                )}
                {isSubmitted && (
                    <div className='w-full h-full absolute top-0 left-0 flex justify-center items-center'>
                         <div className="loader"></div>
                    </div>
                )}
                {isRegistered && (
                    <div className='flex flex-col gap-5'>
                       <h2 className='font-semibold'>USERID: {credgot && (credgot as any)?.cred?.uniqueID}</h2>
                       <h2 className='font-semibold'>Password: {credgot && (credgot as any)?.cred?.password}</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddMemberPopup;
