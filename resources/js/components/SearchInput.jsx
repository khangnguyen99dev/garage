import React from "react";
import { MdSearch } from "react-icons/md";
import { Form } from "reactstrap";
import { DebounceInput } from "react-debounce-input";
import { handleSearch } from "@/store/actions";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function SearchInput() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0 ? "SEARCH_" + pathname.replace("-", "_") : "SEARCH_" + pathname;

    const dispatchs = useDispatch();

    if (handleSearch && pathname !== "ADD" && pathname !== "ADMIN" && pathname !== "INFO") {
        return (
            <Form inline className="cr-search-form" onSubmit={(e) => e.preventDefault()}>
                <MdSearch size="20" className="cr-search-form__icon-search text-secondary" />
                <DebounceInput
                    type="search"
                    debounceTimeout={800}
                    className="cr-search-form__input form-control"
                    placeholder="Tìm kiếm..."
                    onChange={(value) => {
                        dispatchs(handleSearch(value, path));
                    }}
                />
            </Form>
        );
    } else {
        return <div></div>;
    }
}

export default SearchInput;
