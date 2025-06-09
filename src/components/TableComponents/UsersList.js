import { memo } from "react";

export const UsersList = memo((props) => {
  console.count("UsersList: ")
  const { image, user_id, name, phone, email, address, action } = props;
  return (
    <>
      <tr>
        <td className="d-none d-sm-table-cell">
          <img src={image} alt="UserImg" className="w-50" />
        </td>
        <td className="text-small pt-3">{user_id}</td>
        <td className="text-small pt-3">{name}</td>
        <td className="text-small pt-3">{phone}</td>
        <td className="text-small pt-3 d-none d-sm-table-cell">{email}</td>
        <td className="text-small pt-3 d-none d-sm-table-cell">{address}</td>
        <td className="text-small pt-3">{action}</td>
      </tr>
    </>
  );
});
