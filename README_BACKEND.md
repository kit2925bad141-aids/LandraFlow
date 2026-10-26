# LaundraFlow backend

Java 21 + Jakarta Servlet + Tomcat 10.1 + JDBC + MySQL.

## Libraries
Copy these JARs into `backend/lib/`:
- `mysql-connector-j-*.jar`
- Tomcat 10.1 `lib/jakarta.servlet-api.jar`

## Configure database password
Open `src/util/DBConnection.java` and change only `PASSWORD` to your local MySQL root password.

## Compile on Windows PowerShell
From `backend`:

```powershell
Remove-Item -Recurse -Force out -ErrorAction SilentlyContinue
New-Item -ItemType Directory out | Out-Null
$CP = "lib\*"
javac -cp $CP -d out (Get-ChildItem -Recurse src -Filter *.java | ForEach-Object FullName)
```

Deploy compiled classes under:
`Tomcat/webapps/LaundraFlow/WEB-INF/classes/`

Copy MySQL connector into:
`Tomcat/webapps/LaundraFlow/WEB-INF/lib/`

The servlet API JAR must NOT be copied into `WEB-INF/lib` when using Tomcat's own servlet API.
