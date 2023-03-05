1.Install Virtual Env
pip install venv

2.Create Virtual env called 'env'
pythom -venv env 

3.Activate venv
env/Scripts/activate 

If Error, Add this to settings.json in VSCODE

"terminal.integrated.profiles.windows": {
        "PowerShell": {
          "source": "PowerShell",
          "icon": "terminal-powershell",
          "args": ["-ExecutionPolicy", "Bypass"]
        }
      },
      "terminal.integrated.defaultProfile.windows": "PowerShell",
}

4.Install all requirements
pip install -r requirements.txt

5.If new dependency added, freeze requirements 
pip freeze > requirements.txt