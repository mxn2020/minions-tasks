"""Tests for minions-tasks."""

from minions_tasks import create_client, __version__


def test_version():
    """Test that version is set."""
    assert __version__ == "0.1.0"


def test_create_client():
    """Test client creation."""
    client = create_client()
    assert client["version"] == "0.1.0"


def test_create_client_with_options():
    """Test client creation with options."""
    client = create_client(debug=True)
    assert client["debug"] is True
