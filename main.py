from app import app
import os

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Get host from environment variable or default to localhost for VS Code
    host = os.environ.get('HOST', 'localhost')
    app.run(host=host, port=port, debug=True)