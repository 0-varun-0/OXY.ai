from app.core.security import get_password_hash, verify_password

def test_password_hashing():
    password = "a-very-secret-password"
    hashed_password = get_password_hash(password)

    assert hashed_password != password
    assert verify_password(password, hashed_password) is True
    assert verify_password("wrong-password", hashed_password) is False
