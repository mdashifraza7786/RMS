"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AddMemberPopup from './AddMemberPopup';
import { Member } from './components/MemberTypes';

// Import the new components
import MemberHeader from './components/MemberHeader';
import MemberSearch from './components/MemberSearch';
import MembersList from './components/MembersList';
import ViewMemberModal from './components/ViewMemberModal';
import EditMemberModal from './components/EditMemberModal';
import DeleteMemberModal from './components/DeleteMemberModal';

const Page: React.FC = () => {
    const [memberData, setMemberData] = useState<Member[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);
    
    // Modal states
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [detailsPopupVisible, setDetailsPopupVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Member | null>(null);
    const [editData, setEditData] = useState<Member | null>(null);
    const [addMemberPopupVisible, setAddMemberPopupVisible] = useState<boolean>(false);
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteMemberName, setDeleteMemberName] = useState("");
    const [deleteMemberId, setDeleteMemberId] = useState("");
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);

    useEffect(() => {
        document.title = "Members";
        fetchMemberData();
    }, [page, searchQuery]);

    const fetchMemberData = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axios.get(`/api/members`, {
                params: { page, search: searchQuery }
            });
            const { users, payouts, addresses } = response.data;

            if (users.length < 10) {
                setHasMore(false);
            }

            if (users.length > 0) {
                const combinedData = users.map((user: any, index: number) => ({
                    ...user,
                    ...payouts[index],
                    ...addresses[index]
                }));

                setMemberData(prevData => {
                    const existingIds = new Set(prevData.map(item => item.userid));
                    const newItems = combinedData.filter((item: any) => !existingIds.has(item.userid));
                    return [...prevData, ...newItems];
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (data: Member) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleViewClick = (data: Member) => {
        setSelectedItem(data);
        setDetailsPopupVisible(true);
    };

    const handleDeleteClick = (userid: string, name: string) => {
        setDeletePopupVisible(true);
        setDeleteMemberId(userid);
        setDeleteMemberName(name);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const filteredData = memberData.filter(item =>
        String(item.userid).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.role).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.mobile).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMemberPopup = () => {
        setAddMemberPopupVisible(!addMemberPopupVisible);
    };

    const handleEditMember = async (editData: Member) => {
        try {
            setEditLoading(true);
            const response = await fetch('/api/members/updateMember', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            if (!response.ok) {
                throw new Error('Failed to update member');
            } else {
                const result = await response.json();
                fetchMemberData();
            }
        } catch (error) {
            console.error('Error updating member:', error);
        } finally {
            setEditLoading(false);
            setEditPopupVisible(false);
        }
    };

    const handleDeleteMember = async (deleteMemberId: string) => {
        try {
            setDeleteLoading(true);
            await axios.delete("/api/members/delete", { data: { userid: deleteMemberId } });
            setMemberData(prevData => prevData.filter(member => member.userid !== deleteMemberId));
            setDeletePopupVisible(false);
        } catch (error) {
            console.error("Error deleting member:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editData) return;
        
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({ ...editData, photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 md:px-6 lg:max-w-[90%] xl:max-w-7xl 2xl:max-w-[1400px] font-sans">
            <MemberHeader onAddMember={handleAddMemberPopup} />
            
            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header with search */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                        <MemberSearch 
                            searchQuery={searchQuery} 
                            setSearchQuery={setSearchQuery} 
                        />
                    </div>
                                        </div>

                <MembersList 
                    members={filteredData}
                    loading={loading}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                    onView={(member) => handleViewClick(member)}
                    onEdit={(member) => handleEditClick(member)}
                    onDelete={handleDeleteClick}
                                            />
                                        </div>

            {/* Modals */}
            {addMemberPopupVisible && (
                <AddMemberPopup onHandle={handleAddMemberPopup} />
            )}
            
            {selectedItem && (
                <ViewMemberModal 
                    member={selectedItem}
                    isVisible={detailsPopupVisible}
                    onClose={() => setDetailsPopupVisible(false)}
                />
            )}
            
            {editData && (
                <EditMemberModal 
                    isVisible={editPopupVisible}
                    memberData={editData}
                    loading={editLoading}
                    onClose={() => setEditPopupVisible(false)}
                    onSave={handleEditMember}
                    onChange={setEditData}
                    onFileChange={handleFileChange}
                />
            )}
            
            <DeleteMemberModal 
                isVisible={deletePopupVisible}
                memberName={deleteMemberName}
                memberID={deleteMemberId}
                loading={deleteLoading}
                onClose={() => setDeletePopupVisible(false)}
                onDelete={handleDeleteMember}
            />
            </div>
    );
};

export default Page;
