import React from 'react';
import { FaEye, FaTrash, FaUserEdit, FaUserSlash } from "react-icons/fa";
import { Bars } from 'react-loader-spinner';
import { Member } from './MemberTypes';
import Image from 'next/image';

interface MembersListProps {
  members: Member[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (userid: string, name: string) => void;
}

const MembersList: React.FC<MembersListProps> = ({ 
  members, 
  loading, 
  hasMore, 
  onLoadMore, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  if (loading && members.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Bars
          height="50"
          width="50"
          color="primary"
          ariaLabel="bars-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length > 0 ? (
              members.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.userid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                        {member.photo ? (
                          <Image 
                            src={member.photo} 
                            alt={member.name} 
                            className="h-full w-full object-cover"
                            style={{ objectPosition: 'center' }}
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500 font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">{member.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.role === 'chef' ? 'bg-blue-100 text-blue-800' : 
                      member.role === 'waiter' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(member)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => onEdit(member)}
                        className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                        title="Edit member"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        onClick={() => onDelete(member.userid, member.name)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                        title="Delete member"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FaUserSlash className="text-primary text-2xl" />
                    <p className="text-lg font-medium">No members found</p>
                    <p className="mt-1 text-sm">Try adjusting your search or add a new member.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden px-4">
        {members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                      {member.photo ? (
                        <Image 
                          src={member.photo} 
                          alt={member.name} 
                          className="h-full w-full object-cover"
                          style={{ objectPosition: 'center' }}
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500 font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-gray-800">{member.name}</div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.role === 'chef' ? 'bg-blue-100 text-blue-800' : 
                    member.role === 'waiter' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role.toUpperCase()}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">ID</span>
                    <span className="text-sm font-medium">{member.userid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-sm">{member.mobile}</span>
                  </div>
                  {member.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm">{member.email}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end space-x-2">
                  <button
                    onClick={() => onView(member)}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                    title="View details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEdit(member)}
                    className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                    title="Edit member"
                  >
                    <FaUserEdit />
                  </button>
                  <button
                    onClick={() => onDelete(member.userid, member.name)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                    title="Delete member"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FaUserSlash className="text-primary text-2xl" />
              <p className="text-lg font-medium">No members found</p>
              <p className="mt-1 text-sm">Try adjusting your search or add a new member.</p>
            </div>
          </div>
        )}
      </div>
      
      {hasMore && !loading && members.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default MembersList; 