import React, { useState, useEffect } from "react";
import { paginate } from "../utils/paginate";
import Pagination from "../components/pagination";
import api from "../api";
import PropTypes from "prop-types";
import GroupList from "../components/groupList";
import SearchStatus from "../components/searchStatus";
import UserTable from "../components/usersTable";
import _ from "lodash";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [professions, setProfession] = useState();
  const [selectedProf, setSelectedProf] = useState();
  const [sortBy, setSortBy] = useState({ iter: "name", order: "asc" });
  const pageSize = 8;

  const [users, setUsers] = useState(api.users.fetchAll());
  const handleDelete = (userId) => {
    const newUsers = users.filter((user) => user._id !== userId);
    setUsers(newUsers);
  };

  const handleToggleBookMark = (userId) => {
    const newUsers = users.map((user) => {
      if (user._id === userId) user.bookmark = !user.bookmark;
      return user;
    });
    setUsers(newUsers);
  };

  useEffect(() => {
    api.professions.fetchAll().then((data) => setProfession(data));
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProf]);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleSort = (item) => {
    setSortBy(item);
  };

  const handleProfessionSelect = (item) => {
    setSelectedProf(item);
  };
  const filteredUsers = selectedProf
    ? users.filter((user) => user.profession._id === selectedProf._id)
    : users;
  const count = filteredUsers.length;
  const sortedUsers = _.orderBy(filteredUsers, [sortBy.path], [sortBy.order]);
  const usersGrop = paginate(sortedUsers, currentPage, pageSize);
  const clearFilter = () => {
    setSelectedProf();
  };
  const renderTable = () => {
    return users && count !== 0 ? (
      <div className="d-flex">
        {professions && (
          <div className="d-flex flex-column flex-shrink-0 p-3">
            <GroupList
              selectedItem={selectedProf}
              items={professions}
              onItemSelect={handleProfessionSelect}
            />
            <button className="btn btn-secondary mt-2" onClick={clearFilter}>
              {" "}
              Очистить
            </button>
          </div>
        )}
        <div className="d-flex flex-column">
          <SearchStatus length={count} />
          {count > 0 && (
            <UserTable
              users={usersGrop}
              onSort={handleSort}
              selectedSort={sortBy}
              onDelete={handleDelete}
              onToggleBookMark={handleToggleBookMark}
            />
          )}
          <div className="d-flex justify-content-center">
            <Pagination
              itemsCount={count}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageShange={handlePageChange}
            />
          </div>
        </div>
      </div>
    ) : (
      ""
    );
  };
  return <>{renderTable()}</>;
};

Users.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Users;