"""
Minions Tasks Python SDK

Task and work management across agents, humans, and workflows
"""

__version__ = "0.1.0"


def create_client(**kwargs):
    """Create a client for Minions Tasks.

    Args:
        **kwargs: Configuration options.

    Returns:
        dict: Client configuration.
    """
    return {
        "version": __version__,
        **kwargs,
    }

from .schemas import *
