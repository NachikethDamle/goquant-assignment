def evaluate_condition(row, cond):
    lhs = cond["lhs"]
    rhs = cond["rhs"]
    op = cond["operator"]

    # ✅ Fetch LHS value safely
    lhs_val = row.get(lhs) if isinstance(lhs, str) else lhs

    # ✅ Parse RHS correctly
    if isinstance(rhs, str):
        # Try to get from row; if not, maybe it's a numeric string (e.g. "70")
        rhs_val = row.get(rhs)
        if rhs_val is None:
            try:
                rhs_val = float(rhs)
            except ValueError:
                raise ValueError(f"Invalid condition evaluation: Missing indicator in DataFrame: '{rhs}'")
    else:
        rhs_val = rhs

    # ✅ Apply comparison
    if op == ">": return lhs_val > rhs_val
    if op == "<": return lhs_val < rhs_val
    if op == ">=": return lhs_val >= rhs_val
    if op == "<=": return lhs_val <= rhs_val
    if op == "=": return lhs_val == rhs_val

    raise ValueError(f"Unsupported operator: {op}")
